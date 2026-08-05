"use client";

import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  mapAuthError,
  profileFromRow,
  sessionResultFromRow,
  type ProfileRow,
  type SessionResultRow,
} from "@/lib/auth/profile";
import type {
  AuthSession,
  ProgressStats,
  SessionResult,
  UserProfile,
} from "@/lib/auth/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthActionResult {
  error?: string;
  needsEmailConfirmation?: boolean;
}

interface AuthContextValue {
  ready: boolean;
  configured: boolean;
  user: UserProfile | null;
  session: AuthSession | null;
  results: SessionResult[];
  progress: ProgressStats;
  register: (input: RegisterInput) => Promise<AuthActionResult>;
  login: (input: LoginInput) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  addSessionResult: (
    result: Omit<SessionResult, "id" | "userId" | "createdAt">,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function computeProgress(results: SessionResult[]): ProgressStats {
  if (results.length === 0) {
    return {
      sessionsCount: 0,
      averagePercentage: null,
      bestPercentage: null,
      lastSessionAt: null,
    };
  }
  const sum = results.reduce((acc, r) => acc + r.percentage, 0);
  return {
    sessionsCount: results.length,
    averagePercentage: Math.round(sum / results.length),
    bestPercentage: Math.max(...results.map((r) => r.percentage)),
    lastSessionAt: results[0]?.createdAt ?? null,
  };
}

function authSessionFromUser(
  userId: string,
  email: string,
  name: string,
): AuthSession {
  return { userId, email, name };
}

async function fetchProfileForUser(
  userId: string,
  email: string,
  fallbackName?: string,
): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (data) {
    return profileFromRow(data as ProfileRow, email);
  }

  if (error) {
    console.error("fetchProfileForUser", error.message);
  }

  const name = fallbackName?.trim() || email.split("@")[0] || "Uczeń";
  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .insert({ id: userId, name })
    .select("*")
    .single();

  if (insertError || !inserted) {
    console.error("fetchProfileForUser insert", insertError?.message);
    return null;
  }

  return profileFromRow(inserted as ProfileRow, email);
}

async function fetchResultsForUser(userId: string): Promise<SessionResult[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("session_results")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchResultsForUser", error.message);
    return [];
  }

  return (data as SessionResultRow[]).map(sessionResultFromRow);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [results, setResults] = useState<SessionResult[]>([]);

  const applyAuthSession = useCallback(async (authSession: Session | null) => {
    if (!authSession?.user) {
      setSession(null);
      setUser(null);
      setResults([]);
      return;
    }

    const email = authSession.user.email ?? "";
    const fallbackName =
      (authSession.user.user_metadata?.name as string | undefined) ?? email;

    const profile = await fetchProfileForUser(
      authSession.user.id,
      email,
      fallbackName,
    );

    if (!profile) {
      setSession(null);
      setUser(null);
      setResults([]);
      return;
    }

    const userResults = await fetchResultsForUser(authSession.user.id);

    setSession(authSessionFromUser(profile.id, profile.email, profile.name));
    setUser(profile);
    setResults(userResults);
  }, []);

  useEffect(() => {
    if (!configured) {
      setReady(true);
      return;
    }

    const supabase = createClient();
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      if (!mounted) return;
      void applyAuthSession(current).finally(() => {
        if (mounted) setReady(true);
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, current) => {
      void applyAuthSession(current);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured, applyAuthSession]);

  const register = useCallback(
    async ({ email, password, name }: RegisterInput): Promise<AuthActionResult> => {
      if (!configured) {
        return { error: "Auth nie jest skonfigurowany (brak Supabase)." };
      }

      const normalized = email.trim().toLowerCase();
      if (!normalized || !password || !name.trim()) {
        return { error: "Uzupełnij wszystkie pola." };
      }
      if (password.length < 6) {
        return { error: "Hasło musi mieć co najmniej 6 znaków." };
      }

      const supabase = createClient();
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { data, error } = await supabase.auth.signUp({
        email: normalized,
        password,
        options: {
          data: { name: name.trim() },
          emailRedirectTo: `${origin}/auth/callback?next=/panel`,
        },
      });

      if (error) {
        return { error: mapAuthError(error.message) };
      }

      if (data.user && !data.session) {
        return { needsEmailConfirmation: true };
      }

      await applyAuthSession(data.session);
      return {};
    },
    [configured, applyAuthSession],
  );

  const login = useCallback(
    async ({ email, password }: LoginInput): Promise<AuthActionResult> => {
      if (!configured) {
        return { error: "Auth nie jest skonfigurowany (brak Supabase)." };
      }

      const normalized = email.trim().toLowerCase();
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password,
      });

      if (error) {
        return { error: mapAuthError(error.message) };
      }

      await applyAuthSession(data.session);
      return {};
    },
    [configured, applyAuthSession],
  );

  const logout = useCallback(async () => {
    if (!configured) return;

    const supabase = createClient();
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setResults([]);
  }, [configured]);

  const refreshProfile = useCallback(async () => {
    if (!configured) return;

    const supabase = createClient();
    const {
      data: { session: current },
    } = await supabase.auth.getSession();
    await applyAuthSession(current);
  }, [configured, applyAuthSession]);

  const addSessionResult = useCallback(
    async (
      result: Omit<SessionResult, "id" | "userId" | "createdAt">,
    ) => {
      if (!configured || !user) return;

      const supabase = createClient();

      const { data, error } = await supabase
        .from("session_results")
        .insert({
          user_id: user.id,
          question_code: result.questionCode,
          question_kind: result.questionKind,
          question_title: result.questionTitle,
          total_points: result.totalPoints,
          max_points: result.maxPoints,
          percentage: result.percentage,
          criteria: result.criteria,
        })
        .select("*")
        .single();

      if (error || !data) {
        console.error("addSessionResult", error?.message);
        return;
      }

      const entry = sessionResultFromRow(data as SessionResultRow);
      setResults((prev) => [entry, ...prev]);
    },
    [configured, user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      configured,
      user,
      session,
      results,
      progress: computeProgress(results),
      register,
      login,
      logout,
      refreshProfile,
      addSessionResult,
    }),
    [
      ready,
      configured,
      user,
      session,
      results,
      register,
      login,
      logout,
      refreshProfile,
      addSessionResult,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth musi być użyty wewnątrz AuthProvider");
  }
  return ctx;
}
