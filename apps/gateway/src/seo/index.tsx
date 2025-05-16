
const title = 'APE | La Source'
const description = "Le site de l'association des parents d'élèves de l'école nouvelle la Source"
const parentOrg = {
  '@type': 'EducationalOrganization',
  name: 'La Source - École nouvelle fondée en 1946',
  description: "La Source est une école nouvelle privée, non confessionnelle, à vocation expérimentale, sous contrat d'association avec l'État.",
  telephone: '+33 1 46 26 99 88',
  email: 'mailto:accueil@ecolelasource.org',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Meudon',
    addressRegion: 'Île-de-France',
    postalCode: 'F-92190',
    streetAddress: '11 rue Ernest-Renan 92190 Meudon'
  },
  logo: `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL}/logo/la_source/LaSource.svg`,
  image: `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL}/logo/la_source/LaSource.svg`,
}
const subOrg = {
  '@type': 'Organization',
  name: title,
  description: description,
  email: 'mailto:lasource.ape@gmail.com',
  logo: `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL}/logo/ape/ape_la_source_logo_1.svg`,
}
const jsonLd = {
  '@context': 'https://schema.org',
  ...parentOrg,
  subOrganization: {
    ...subOrg
  },
  mainEntityOfPage: {
    '@type': 'CreativeWork',
    name: 'Web App Périscolaire',
    description: "Créateur d'événements périscolaire pour l'école nouvelle la Source",
    url: `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL}/web-app`,
    author: {
      '@type': 'Person',
      image: `${process.env.NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL}/logo/filled/rectangle/logo_flexiness_2.svg`,
      name: 'Flexiness',
      sameAs: 'https://ci.flexiness.com/portfolio'
    },
    sourceOrganization: {
      ...subOrg
    },
    parentOrganization: {
      ...parentOrg
    }
  },
}

export { title, description, jsonLd }
