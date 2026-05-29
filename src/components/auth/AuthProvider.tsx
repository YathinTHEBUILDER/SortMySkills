"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface AuthContextValue {
  configured: boolean;
  loading: boolean;
  user: User | null;
  session: Session | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const [loading, setLoading] = useState(configured);
  const [session, setSession] = useState<Session | null>(null);

  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return { error: "Supabase is not configured. Add keys to .env.local." };
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return { error: "Supabase is not configured. Add keys to .env.local." };
      }
      const { error } = await supabase.auth.signUp({ email, password });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  }, [supabase]);

  const value: AuthContextValue = {
    configured,
    loading,
    user: session?.user ?? null,
    session,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
