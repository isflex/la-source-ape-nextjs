import React from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@src/seo";

export const metadata: Metadata = buildMetadata({
  title: "Créer une newsletter",
  description: `Rédigez et publiez une newsletter pour les parents d'élèves de ${process.env.NEXT_PUBLIC_SCHOOL_TITLE_GENERIC}.`,
  path: "/newsletter/creer",
});

export default function NewsletterCreerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section style={{ minHeight: "100vh" }}>{children}</section>;
}
