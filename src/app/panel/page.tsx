import type { Metadata } from "next";
import { UserPanel } from "@/components/panel/UserPanel";

export const metadata: Metadata = {
  title: "Mój panel",
  description: "Twój plan, postępy i historia wyników matury ustnej.",
};

export default function PanelPage() {
  return (
    <div className="border-b-2 border-ink bg-transparent">
      <UserPanel />
    </div>
  );
}
