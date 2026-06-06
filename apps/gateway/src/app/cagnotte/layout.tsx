import React from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@src/seo";
import { isStripeTestMode } from "@src/lib/secrets";
import { SandboxModeProvider } from "@src/components/cagnotte/SandboxModeContext";

export const metadata: Metadata = buildMetadata({
  title: "Cagnottes",
  description: `Plateforme de cagnottes collectives pour les cadeaux de fin d'année destinés aux enseignants de ${process.env.NEXT_PUBLIC_SCHOOL_TITLE_GENERIC}.`,
  path: "/cagnotte",
});

export default async function CagnotteSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const testMode = await isStripeTestMode();

  return <SandboxModeProvider value={testMode}>{children}</SandboxModeProvider>;
}
