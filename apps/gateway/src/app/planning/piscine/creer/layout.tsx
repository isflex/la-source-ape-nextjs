import React from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@src/seo";

export const metadata: Metadata = buildMetadata({
  title: "Créer un planning piscine",
  description: `Organisez le planning des parents accompagnateurs pour les séances de piscine ou les autres sorties de classe de ${process.env.NEXT_PUBLIC_SCHOOL_TITLE_GENERIC}.`,
  path: "/planning/piscine/creer",
});

export default function PiscineCreerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section style={{ minHeight: "100vh" }}>{children}</section>;
}
