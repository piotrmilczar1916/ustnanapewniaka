export type PlanId = "free" | "full";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  /** SHA-256 hex — lokalny MVP; TODO: Supabase Auth */
  passwordHash: string;
  plan: PlanId;
  /** ISO date — koniec pełnego dostępu (dzień egzaminu) */
  accessUntil: string | null;
  createdAt: string;
}

export interface SessionResult {
  id: string;
  userId: string;
  createdAt: string;
  questionCode: string;
  questionKind: "jawne" | "niejawne";
  questionTitle: string;
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  criteria: Array<{
    id: string;
    label: string;
    points: number;
    maxPoints: number;
  }>;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
}

export interface ProgressStats {
  sessionsCount: number;
  averagePercentage: number | null;
  bestPercentage: number | null;
  lastSessionAt: string | null;
}
