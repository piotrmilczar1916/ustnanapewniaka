import type { AuthSession, SessionResult, UserProfile } from "@/lib/auth/types";

const USERS_KEY = "unp.users";
const SESSION_KEY = "unp.session";
const RESULTS_KEY = "unp.results";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getUsers(): UserProfile[] {
  return readJson<UserProfile[]>(USERS_KEY, []);
}

export function saveUsers(users: UserProfile[]) {
  writeJson(USERS_KEY, users);
}

export function getSession(): AuthSession | null {
  return readJson<AuthSession | null>(SESSION_KEY, null);
}

export function saveSession(session: AuthSession | null) {
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }
  writeJson(SESSION_KEY, session);
}

export function getResults(): SessionResult[] {
  return readJson<SessionResult[]>(RESULTS_KEY, []);
}

export function saveResults(results: SessionResult[]) {
  writeJson(RESULTS_KEY, results);
}

export function getResultsForUser(userId: string): SessionResult[] {
  return getResults()
    .filter((r) => r.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function upsertUser(user: UserProfile) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  saveUsers(users);
}

export function findUserByEmail(email: string): UserProfile | undefined {
  const normalized = email.trim().toLowerCase();
  return getUsers().find((u) => u.email === normalized);
}

export function findUserById(id: string): UserProfile | undefined {
  return getUsers().find((u) => u.id === id);
}
