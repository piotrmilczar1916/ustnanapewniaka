import type { Metadata } from "next";
import {
  Big_Shoulders,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
});

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "UstnaNaPewniaka.pl — symulator matury ustnej",
    template: "%s · UstnaNaPewniaka.pl",
  },
  description:
    "Trening matury ustnej z polskiego 2026/2027. Losujesz pytanie, mówisz na czas, AI ocenia wg kryteriów CKE z cytatami z Twojej wypowiedzi.",
  metadataBase: new URL("https://ustnanapewniaka.pl"),
  openGraph: {
    title: "UstnaNaPewniaka.pl — symulator matury ustnej",
    description:
      "Darmowa symulacja matury ustnej. Ocena wg 4 kryteriów CKE z cytatami z Twojej wypowiedzi.",
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${bigShoulders.variable} ${ibmPlex.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-ink">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
