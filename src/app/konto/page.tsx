import { redirect } from "next/navigation";

/** Stary URL — przekierowanie do Mój panel */
export default function KontoRedirectPage() {
  redirect("/panel");
}
