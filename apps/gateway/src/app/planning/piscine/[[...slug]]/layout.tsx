'use client';

import React from 'react';

export default function PiscineSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section style={{ minHeight: '100vh' }}>{children}</section>
  )
}
