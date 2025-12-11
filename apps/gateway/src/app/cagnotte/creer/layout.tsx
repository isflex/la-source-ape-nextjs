import React from 'react';

export default function CagnotteCreerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section style={{ minHeight: '100vh' }}>{children}</section>
  );
}
