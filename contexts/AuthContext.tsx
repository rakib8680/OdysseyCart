"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { syncUser } from "@/app/actions/users";

// ---------- types ----------
interface AuthContextType {
  user: User | null;
  dbUser: any | null;
  loading: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

// ---------- context API ----------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- provider ----------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const isRegistering = useRef(false);

  // This is a listener function, for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // During registration, register() handles syncUser manually
        // with the correct displayName after updateProfile completes.
        if (!isRegistering.current) {
          const result = await syncUser(
            currentUser.uid,
            currentUser.email!,
            currentUser.displayName || undefined,
          );

          if (result.success) {
            setDbUser(result.user);
          } else {
            setDbUser(null);
          }
        }
      } else {
        setDbUser(null);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // register with email & password
  const register = async (email: string, password: string, name: string) => {
    isRegistering.current = true;
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(result.user, { displayName: name });

      // Manually sync with the correct name — the listener skipped this
      const dbResult = await syncUser(result.user.uid, email, name);
      if (dbResult.success) {
        setDbUser(dbResult.user);
      }
    } finally {
      isRegistering.current = false;
    }
  };

  // login with email & password
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // login with Google popup
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // logout
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------- hook ----------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
