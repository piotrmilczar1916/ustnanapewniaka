import type {
  PlanId,
  SessionResult,
  UserProfile,
} from "@/lib/auth/types";

export interface ProfileRow {
  id: string;
  name: string;
  plan: PlanId;
  access_until: string | null;
  created_at: string;
}

export interface SessionResultRow {
  id: string;
  user_id: string;
  created_at: string;
  question_code: string;
  question_kind: "jawne" | "niejawne";
  question_title: string;
  total_points: number;
  max_points: number;
  percentage: number;
  criteria: SessionResult["criteria"];
}

export function profileFromRow(
  row: ProfileRow,
  email: string,
): UserProfile {
  return {
    id: row.id,
    email,
    name: row.name,
    plan: row.plan,
    accessUntil: row.access_until,
    createdAt: row.created_at,
  };
}

export function sessionResultFromRow(row: SessionResultRow): SessionResult {
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    questionCode: row.question_code,
    questionKind: row.question_kind,
    questionTitle: row.question_title,
    totalPoints: row.total_points,
    maxPoints: row.max_points,
    percentage: row.percentage,
    criteria: row.criteria ?? [],
  };
}

export function mapAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Nieprawidłowy e-mail lub hasło.";
  }
  if (normalized.includes("user already registered")) {
    return "Konto z tym e-mailem już istnieje.";
  }
  if (normalized.includes("password should be at least")) {
    return "Hasło musi mieć co najmniej 6 znaków.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Potwierdź adres e-mail — sprawdź skrzynkę odbiorczą.";
  }
  if (normalized.includes("rate limit")) {
    return "Zbyt wiele prób. Spróbuj ponownie za chwilę.";
  }

  return message;
}
