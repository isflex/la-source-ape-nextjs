import type { Metadata } from 'next';
import { buildMetadata } from '@src/seo';

export const metadata: Metadata = buildMetadata({
  title: 'À propos des cagnottes',
  description:
    "Découvrez la plateforme de cagnottes collectives APE La Source : fonctionnement, sécurité des paiements Stripe et contact.",
  path: '/cagnotte/info',
});

export default function CagnotteInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
