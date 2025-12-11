import React from 'react';

export default function CompteStripeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section style={{ minHeight: '100vh' }}>{children}</section>
  );
}
