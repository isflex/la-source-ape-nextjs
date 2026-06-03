import React from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@src/seo";

export const metadata: Metadata = buildMetadata({
  title: "Créer une cagnotte",
  description: `Créez une cagnotte collective pour offrir un cadeau de fin d'année à un enseignant de ${process.env.NEXT_PUBLIC_SCHOOL_TITLE_GENERIC}.`,
  path: "/cagnotte/creer",
});

export default function CagnotteCreerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section style={{ minHeight: "100vh" }}>{children}</section>;
}
