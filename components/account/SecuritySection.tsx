"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { Lock, ExternalLink } from "lucide-react";

// ==========================================
// SECURITY SECTION — provider-aware password management
// ==========================================
export function SecuritySection() {
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Detect auth provider — Google users don't have a Firebase password
  const isGoogleUser =
    user?.providerData?.[0]?.providerId === "google.com";

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    setIsSending(true);
    setEmailSent(false);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email.");
    }
    setIsSending(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Lock className="w-4 h-4 text-slate-500" />
        Security
      </h2>

      {isGoogleUser ? (
        /* Google OAuth users — no password to reset */
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Your account is managed by Google. To change your password, visit
            your Google Account security settings.
          </p>
          <a
            href="https://myaccount.google.com/security"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Google Account Settings
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        /* Email/password users — password reset via email */
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            We&apos;ll send a password reset link to{" "}
            <span className="font-medium text-slate-900">{user?.email}</span>.
          </p>
          <Button
            onClick={handlePasswordReset}
            disabled={isSending || emailSent}
            variant="outline"
            size="sm"
            className="text-xs font-semibold h-9 px-4 gap-1.5"
          >
            {isSending ? (
              <>
                <Spinner className="w-3.5 h-3.5" />
                Sending...
              </>
            ) : emailSent ? (
              "Email Sent"
            ) : (
              "Send Reset Email"
            )}
          </Button>

          {emailSent && (
            <p className="text-xs text-amber-600 mt-2 font-medium">
              If you don't see it within a few minutes, please check your spam or junk folder.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
