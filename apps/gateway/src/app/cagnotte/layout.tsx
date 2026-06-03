import React from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@src/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cagnottes",
  description: `Plateforme de cagnottes collectives pour les cadeaux de fin d'année destinés aux enseignants de ${process.env.NEXT_PUBLIC_SCHOOL_TITLE_GENERIC}.`,
  path: "/cagnotte",
});

export default function CagnotteSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
