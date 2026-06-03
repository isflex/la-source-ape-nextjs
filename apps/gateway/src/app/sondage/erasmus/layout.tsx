import type { Metadata } from "next";
import { buildMetadata } from "@src/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sondage Erasmus",
  description: `Sondage sur la mobilité Erasmus destiné aux familles de ${process.env.NEXT_PUBLIC_SCHOOL_TITLE_GENERIC}.`,
  path: "/sondage/erasmus",
});

export default function ErasmusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section style={{ minHeight: "100vh" }}>{children}</section>;
}
