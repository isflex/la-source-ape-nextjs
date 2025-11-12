'use client';

import React from 'react';

export default function PiscineCreerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section style={{ minHeight: '80vh' }}>{children}</section>
  );
}
