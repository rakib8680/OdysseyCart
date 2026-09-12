/**
 * Generic Firebase ID Token verification service.
 *
 * Cryptographically verifies tokens using Google's Identity Toolkit REST API.
 * Reusable across any API route, webhook, or server-side handler in the application
 * without requiring heavy server SDKs or service account JSON keys.
 */

export interface VerifiedTokenPayload {
  uid: string;
  email?: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: "MISSING_TOKEN" | "MALFORMED_TOKEN" | "EXPIRED_TOKEN" | "INVALID_TOKEN" | "CONFIG_ERROR" | "NETWORK_ERROR",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Validates a Firebase ID Token.
 * 1. Checks structure & expiration locally for fast rejection of stale tokens.
 * 2. Cryptographically verifies authenticity against Google Identity Toolkit.
 *
 * @param token - Bearer JWT string from client Firebase Auth
 * @returns Verified user ID and optional email
 */
export async function verifyFirebaseToken(token: string): Promise<VerifiedTokenPayload> {
  if (!token || typeof token !== "string") {
    throw new AuthError("Missing authentication token.", "MISSING_TOKEN");
  }

  // Fast pre-check: inspect JWT payload structure (header.payload.signature)
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new AuthError("Malformed authentication token.", "MALFORMED_TOKEN");
  }

  try {
    const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    // Fast-fail if token is already expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new AuthError("Session expired. Please log in again.", "EXPIRED_TOKEN");
    }

    // Verify token audience matches current Firebase Project ID if configured
    const expectedProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (expectedProjectId && payload.aud && payload.aud !== expectedProjectId) {
      throw new AuthError("Invalid token audience.", "INVALID_TOKEN");
    }
  } catch (err: any) {
    if (err instanceof AuthError) throw err;
    throw new AuthError("Invalid token structure.", "MALFORMED_TOKEN");
  }

  // Cryptographically verify the token with Google Identity Toolkit REST API
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    console.error("[Auth] Missing NEXT_PUBLIC_FIREBASE_API_KEY environment variable.");
    throw new AuthError("Server configuration error: Firebase API key missing.", "CONFIG_ERROR");
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn("[Auth] Token verification failed via Google Identity API:", errorData);
      throw new AuthError("Invalid or revoked authentication token.", "INVALID_TOKEN");
    }

    const data = await response.json();
    const user = data?.users?.[0];

    if (!user?.localId) {
      throw new AuthError("Could not resolve user identity from token.", "INVALID_TOKEN");
    }

    return {
      uid: user.localId,
      email: user.email,
    };
  } catch (error: any) {
    if (error instanceof AuthError) throw error;
    console.error("[Auth] Unexpected network error verifying token:", error);
    throw new AuthError("Failed to communicate with authentication service.", "NETWORK_ERROR");
  }
}
