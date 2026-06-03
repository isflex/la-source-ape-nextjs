# SEO: Establishing Authorship Relationship between APE La Source (Organization) and Flexiness (creator/author)

## Goal

Make the relationship machine-readable and sitewide:

- **APE La Source** = the `Organization` that **publishes/owns** the website (a French *association loi 1901* nonprofit).
- **Flexiness** = the web agency that is the **`creator` / `author`** of the website and the Chaperons&Co web app.
- Currently the only cross-site reference is a plain `<a href>` link between `https://apelasource.org/about/` and `https://www.flexiness.com`. A hyperlink is **not** a machine-readable authorship signal.

## Context / constraints

- `apelasource.org` — site of the nonprofit (association des parents d'élèves de La Source école nouvelle).
- `www.flexiness.com` — Paris web agency (46 rue Vital, 75116 Paris) that built it.
- The `/about` page loads its content from a slides iframe (`/slides/about.html`) — make sure JSON-LD lives in the real page `<head>`, not only inside the iframe.

## The core problem

Three distinct schema.org relationships are being conflated. Map them correctly:

- The **website itself** is a `WebSite` / `CreativeWork`. Flexiness is its `creator` (built it); optionally `author` (wrote the copy).
- **APE La Source** is the `Organization` that is `publisher` / owner.
- The `author` / `creator` of the `CreativeWork` is an `Organization` (Flexiness), cross-referenced by **stable `@id` URIs** shared across both domains. The shared `@id`s are what let Google stitch the entities into one graph — this is the mechanism that makes the relationship "universal," not per-page links.

---

## Task 1 — Add JSON-LD `@graph` to EVERY page on apelasource.org

Inject this into the shared layout/template `<head>` so all pages carry it (not just `/about`).

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://apelasource.org/#organization",
      "name": "Association des Parents d'Élèves de La Source école nouvelle",
      "alternateName": "APE La Source",
      "url": "https://apelasource.org/",
      "sameAs": ["https://apelasource.org/about/"]
    },
    {
      "@type": "WebSite",
      "@id": "https://apelasource.org/#website",
      "url": "https://apelasource.org/",
      "name": "APE La Source",
      "publisher": { "@id": "https://apelasource.org/#organization" },
      "creator": { "@id": "https://www.flexiness.com/#organization" },
      "author": { "@id": "https://www.flexiness.com/#organization" }
    },
    {
      "@type": "Organization",
      "@id": "https://www.flexiness.com/#organization",
      "name": "Flexiness",
      "url": "https://www.flexiness.com/",
      "description": "Agence de développement web basée à Paris",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "46 rue Vital",
        "postalCode": "75116",
        "addressLocality": "Paris",
        "addressCountry": "FR"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://apelasource.org/web-app#app",
      "name": "Chaperons&Co",
      "url": "https://apelasource.org/web-app",
      "applicationCategory": "Lifestyle",
      "creator": { "@id": "https://www.flexiness.com/#organization" },
      "publisher": { "@id": "https://apelasource.org/#organization" }
    }
  ]
}
</script>
```

> Note: a French *association loi 1901* doesn't map cleanly to schema.org `nonprofitStatus` / `NonprofitType` enums. Omit those fields rather than set them wrong.

## Task 2 — Mirror the JSON-LD on flexiness.com

On `flexiness.com`, define the **same** `https://www.flexiness.com/#organization` node, and add a portfolio `CreativeWork` (or reference the APE `WebSite`) where Flexiness is `creator` of `https://apelasource.org/#website`. Reciprocal, `@id`-linked claims across both domains are trusted far more by Google than a one-way link.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.flexiness.com/#organization",
      "name": "Flexiness",
      "url": "https://www.flexiness.com/",
      "description": "Agence de développement web basée à Paris",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "46 rue Vital",
        "postalCode": "75116",
        "addressLocality": "Paris",
        "addressCountry": "FR"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://apelasource.org/#website",
      "url": "https://apelasource.org/",
      "name": "APE La Source",
      "creator": { "@id": "https://www.flexiness.com/#organization" }
    }
  ]
}
</script>
```

## Task 3 — Open Graph metadata (per page `<head>`)

OG is for social-share previews, NOT a Google authorship signal — but `article:author` is the closest OG equivalent. Add:

```html
<meta property="og:site_name" content="APE La Source" />
<meta property="og:title" content="À propos | APE La Source" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://apelasource.org/about/" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://apelasource.org/og-image.png" />
<meta property="article:publisher" content="https://apelasource.org/" />
<meta property="article:author" content="https://www.flexiness.com/" />
```

The real authorship work is done by the JSON-LD, not these tags.

## Task 4 — Make it universal (beyond the single /about link)

1. Inject the `@graph` JSON-LD into the **shared layout/template** so every page carries the APE↔Flexiness references.
2. Add a sitewide footer credit: `<a rel="author" href="https://www.flexiness.com/">Site by Flexiness</a>` on every page (`rel` gives semantic weight a bare link lacks).
3. Reciprocate from flexiness.com with a portfolio/case-study page using the matching `@id`.
4. Validate with Google's Rich Results Test and the Schema.org validator after deploying.

## Acceptance criteria

- JSON-LD present in `<head>` of every page on both domains (in the real document, not only the slides iframe).
- Both domains define a Flexiness `Organization` node with the identical `@id` `https://www.flexiness.com/#organization`.
- APE `WebSite` node references Flexiness as `creator`/`author`; Flexiness side references the APE `WebSite` via the same `@id`.
- Sitewide footer `rel="author"` link to Flexiness.
- OG tags including `article:author` and `article:publisher` on content pages.
- Passes Google Rich Results Test with no errors.

## Stack notes

Site appears to use a templated layout (Next.js is in use elsewhere in this org). Add the JSON-LD via the shared layout/head component so it applies sitewide; if a page's body is rendered through an iframe (e.g. `/slides/about.html`), the structured data must still be in the parent page's `<head>`.
