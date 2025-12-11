import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cagnottes APE La Source - Plateforme de collecte',
  description: 'Plateforme de cagnottes collectives pour les cadeaux enseignants de l\'APE La Source',
};

export default function CagnotteInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
