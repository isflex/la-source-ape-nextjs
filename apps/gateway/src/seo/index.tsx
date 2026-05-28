import type { Metadata } from "next";

const getSiteUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL is not defined");
  }
  return url.replace(/\/$/, "");
};

const title = "APE La Source";
const description =
  "Le site de l'association des parents d'élèves de l'école nouvelle la Source";
const siteUrl = getSiteUrl();
const flexinessUrl = "https://www.flexiness.com";

const ID_WEBSITE = `${siteUrl}/#website`;
const ID_WEBAPP = `${siteUrl}/web-app#app`;
const ID_ORG_APE = `${siteUrl}/#organization`;
const ID_ORG_FLEXINESS = `${flexinessUrl}/#organization`;
const ID_ORG_SCHOOL = `${siteUrl}/#school`;
const ID_LOGO_APE = `${siteUrl}/logo/ape/Logo_512.png#logo`;
const ID_LOGO_FLEXINESS = `${flexinessUrl}/logo_flexiness.svg#logo`;
const ID_LOGO_SCHOOL = `${siteUrl}/logo/la_source/LaSource.svg#logo`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": ID_WEBSITE,
      url: siteUrl,
      name: title,
      description,
      inLanguage: "fr-FR",
      publisher: { "@id": ID_ORG_APE },
      creator: { "@id": ID_ORG_FLEXINESS },
      author: { "@id": ID_ORG_FLEXINESS },
      sourceOrganization: { "@id": ID_ORG_FLEXINESS },
      about: { "@id": ID_ORG_SCHOOL },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": ID_ORG_APE,
      name: title,
      alternateName:
        "Association des parents d'élèves de l'École nouvelle La Source",
      url: siteUrl,
      email: `mailto:${process.env.NEXT_PUBLIC_HELP_EMAIL}`,
      description,
      logo: {
        "@type": "ImageObject",
        "@id": ID_LOGO_APE,
        url: `${siteUrl}/logo/ape/Logo_512.png`,
        contentUrl: `${siteUrl}/logo/ape/Logo_512.png`,
        width: 512,
        height: 512,
        caption: title,
      },
      image: { "@id": ID_LOGO_APE },
      parentOrganization: { "@id": ID_ORG_SCHOOL },
    },
    {
      "@type": "Organization",
      "@id": ID_ORG_FLEXINESS,
      name: "Flexiness",
      url: flexinessUrl,
      description:
        "Agence de développement web basée à Paris — conception et développement de plateformes éducatives et associatives.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "46 rue Vital",
        postalCode: "75116",
        addressLocality: "Paris",
        addressCountry: "FR",
      },
      logo: {
        "@type": "ImageObject",
        "@id": ID_LOGO_FLEXINESS,
        url: `${flexinessUrl}/logo_flexiness.svg`,
        caption: "Flexiness",
      },
      sameAs: [`${siteUrl}/about`],
    },
    {
      "@type": "WebApplication",
      "@id": ID_WEBAPP,
      name: process.env.NEXT_PUBLIC_APP_TITLE || "Chaperons&Co",
      url: `${siteUrl}/web-app`,
      applicationCategory: "Lifestyle",
      description:
        "Une plateforme de gestion d'événements communautaires scolaires. Il permet aux parents d'élèves d'organiser et de participer a des activités d'entraide autour des écoles : covoiturage, pedibus (accompagnement a pied), babysitting, soutien aux devoirs, et autres activités.",
      creator: { "@id": ID_ORG_FLEXINESS },
      publisher: { "@id": ID_ORG_APE },
      isPartOf: { "@id": ID_WEBSITE },
    },
    {
      "@type": "EducationalOrganization",
      "@id": ID_ORG_SCHOOL,
      name: "La Source - École nouvelle fondée en 1946",
      description:
        "La Source est une école nouvelle privée, non confessionnelle, à vocation expérimentale, sous contrat d'association avec l'État.",
      telephone: "+33 1 46 26 99 88",
      email: "mailto:accueil@ecolelasource.org",
      address: {
        "@type": "PostalAddress",
        addressCountry: "FR",
        addressLocality: "Meudon",
        addressRegion: "Île-de-France",
        postalCode: "F-92190",
        streetAddress: "11 rue Ernest-Renan 92190 Meudon",
      },
      logo: {
        "@type": "ImageObject",
        "@id": ID_LOGO_SCHOOL,
        url: `${siteUrl}/logo/la_source/LaSource.svg`,
        caption: "La Source",
      },
      image: { "@id": ID_LOGO_SCHOOL },
      subOrganization: { "@id": ID_ORG_APE },
    },
  ],
};

const defaultOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  siteName: title,
  locale: "fr_FR",
  url: siteUrl,
  title,
  description,
  images: [
    {
      url: "/logo/ape/Logo_512.png",
      width: 512,
      height: 512,
      alt: title,
      type: "image/png",
    },
  ],
};

const defaultTwitter: NonNullable<Metadata["twitter"]> = {
  card: "summary",
  title,
  description,
  images: ["/logo/ape/Logo_512.png"],
};

const defaultRobots: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

const defaultOther: NonNullable<Metadata["other"]> = {
  "og:see_also": flexinessUrl,
  "article:publisher": `${siteUrl}/`,
  "article:author": `${flexinessUrl}/`,
};

type BuildMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

const buildMetadata = ({
  title: pageTitle,
  description: pageDescription,
  path,
  noIndex,
}: BuildMetadataOptions = {}): Metadata => {
  const fullTitle = pageTitle ? `${pageTitle} | ${title}` : title;
  const desc = pageDescription ?? description;
  const canonicalPath = path ?? "/";

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: canonicalPath },
    openGraph: {
      ...defaultOpenGraph,
      title: fullTitle,
      description: desc,
      url: canonicalPath,
    },
    twitter: {
      ...defaultTwitter,
      title: fullTitle,
      description: desc,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : defaultRobots,
    other: defaultOther,
  };
};

export { title, description, siteUrl, flexinessUrl, jsonLd, buildMetadata };
