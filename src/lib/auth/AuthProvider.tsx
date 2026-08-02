"use client";

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
  findUserByEmail,
  findUserById,
  getResultsForUser,
  getSession,
  hashPassword,
  saveResults,
  saveSession,
  getResults,
  upsertUser,
} from "@/lib/auth/storage";
import type {
  AuthSession,
  PlanId,
  ProgressStats,
  SessionResult,
  UserProfile,
} from "@/lib/auth/types";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  ready: boolean;
  user: UserProfile | null;
  session: AuthSession | null;
  results: SessionResult[];
  progress: ProgressStats;
  register: (input: RegisterInput) => Promise<{ error?: string }>;
  login: (input: LoginInput) => Promise<{ error?: string }>;
  logout: () => void;
  setPlan: (plan: PlanId) => void;
  addSessionResult: (
    result: Omit<SessionResult, "id" | "userId" | "createdAt">,
  ) => void;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [results, setResults] = useState<SessionResult[]>([]);

  const hydrate = useCallback(() => {
    const current = getSession();
    if (!current) {
      setSession(null);
      setUser(null);
      setResults([]);
      return;
    }
    const profile = findUserById(current.userId);
    if (!profile) {
      saveSession(null);
      setSession(null);
      setUser(null);
      setResults([]);
      return;
    }
    setSession(current);
    setUser(profile);
    setResults(getResultsForUser(profile.id));
  }, []);

  useEffect(() => {
    hydrate();
    setReady(true);
  }, [hydrate]);

  const register = useCallback(
    async ({ email, password, name }: RegisterInput) => {
      const normalized = email.trim().toLowerCase();
      if (!normalized || !password || !name.trim()) {
        return { error: "Uzupełnij wszystkie pola." };
      }
      if (password.length < 6) {
        return { error: "Hasło musi mieć co najmniej 6 znaków." };
      }
      if (findUserByEmail(normalized)) {
        return { error: "Konto z tym e-mailem już istnieje." };
      }

      const profile: UserProfile = {
        id: crypto.randomUUID(),
        email: normalized,
        name: name.trim(),
        passwordHash: await hashPassword(password),
        plan: "free",
        accessUntil: null,
        createdAt: new Date().toISOString(),
      };

      upsertUser(profile);
      const nextSession: AuthSession = {
        userId: profile.id,
        email: profile.email,
        name: profile.name,
      };
      saveSession(nextSession);
      setSession(nextSession);
      setUser(profile);
      setResults([]);
      return {};
    },
    [],
  );

  const login = useCallback(async ({ email, password }: LoginInput) => {
    const normalized = email.trim().toLowerCase();
    const profile = findUserByEmail(normalized);
    if (!profile) {
      return { error: "Nieprawidłowy e-mail lub hasło." };
    }
    const hash = await hashPassword(password);
    if (hash !== profile.passwordHash) {
      return { error: "Nieprawidłowy e-mail lub hasło." };
    }

    const nextSession: AuthSession = {
      userId: profile.id,
      email: profile.email,
      name: profile.name,
    };
    saveSession(nextSession);
    setSession(nextSession);
    setUser(profile);
    setResults(getResultsForUser(profile.id));
    return {};
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setSession(null);
    setUser(null);
    setResults([]);
  }, []);

  const setPlan = useCallback(
    (plan: PlanId) => {
      if (!user) return;
      const updated: UserProfile = {
        ...user,
        plan,
        accessUntil:
          plan === "full"
            ? // TODO: ustawić realną datę egzaminu ustnego
              "2027-05-15"
            : null,
      };
      upsertUser(updated);
      setUser(updated);
    },
    [user],
  );

  const addSessionResult = useCallback(
    (result: Omit<SessionResult, "id" | "userId" | "createdAt">) => {
      if (!user) return;
      const entry: SessionResult = {
        ...result,
        id: crypto.randomUUID(),
        userId: user.id,
        createdAt: new Date().toISOString(),
      };
      const all = [entry, ...getResults()];
      saveResults(all);
      setResults(getResultsForUser(user.id));
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      user,
      session,
      results,
      progress: computeProgress(results),
      register,
      login,
      logout,
      setPlan,
      addSessionResult,
    }),
    [
      ready,
      user,
      session,
      results,
      register,
      login,
      logout,
      setPlan,
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
