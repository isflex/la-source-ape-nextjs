import type { ComponentType } from 'react'
import { readdirSync } from 'fs'
import { join } from 'path'
import { notFound } from 'next/navigation'

// Statically generate every newsletter article from the _content tree.
// force-static + dynamicParams=false => the full article HTML is prerendered
// at build time (good for SEO/crawlers) and any unknown slug returns 404.
// The interactive sibling routes (creer/, souscrire/) are separate segments and
// keep their own 'use client' / dynamic behaviour.
export const dynamic = 'force-static'
export const dynamicParams = false

// Resolved at build time from apps/gateway (next build cwd). Holds the article
// modules as ./_content/<year>/<month>/<day>/<slug>/index.tsx
const CONTENT_DIR = join(process.cwd(), 'src/app/newsletter/[[...slug]]/_content')

// Walk _content and collect the slug array (path segments) for every index.tsx.
function collectSlugs(dir: string, prefix: string[] = []): string[][] {
  const slugs: string[][] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      slugs.push(...collectSlugs(join(dir, entry.name), [...prefix, entry.name]))
    } else if (entry.name === 'index.tsx' && prefix.length > 0) {
      slugs.push(prefix)
    }
  }
  return slugs
}

export function generateStaticParams(): { slug: string[] }[] {
  // `{ slug: [] }` keeps the /newsletter index route valid so the catch-all
  // layout can redirect it to /newsletter/souscrire/ under dynamicParams=false.
  return [
    { slug: [] as string[] },
    ...collectSlugs(CONTENT_DIR).map((slug) => ({ slug })),
  ]
}

interface NewsletterContentPageProps {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function NewsletterContentPage({ params }: NewsletterContentPageProps) {
  const { slug } = await params

  // The /newsletter index (empty slug) is redirected by the layout before we
  // get here; treat it as not-found defensively.
  if (!slug || slug.length === 0) {
    notFound()
  }

  // Webpack resolves this template-literal import into a context module over
  // ./_content/**, so each statically-generated slug renders its own article.
  let Content: ComponentType
  try {
    Content = (await import(`./_content/${slug.join('/')}/index`)).default
  } catch {
    notFound()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
      <Content />
    </div>
  )
}
