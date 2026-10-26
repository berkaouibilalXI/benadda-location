import { site, vtcUrl } from '../config/site'
import { defaultLanguage, getLanguage, languages, pathFor } from '../i18n'
import { localize } from '../utils/format'

const origin = site.url.replace(/\/$/, '')
export const pageUrl = (code) => origin + pathFor(code)
const absolute = (path) => `${origin}/${path.replace(/^\//, '')}`

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Safe to embed inside <script type="application/ld+json">
const jsonScript = (data) => JSON.stringify(data).replace(/</g, '\\u003c')

const businessId = `${origin}/#business`
const CURRENCY = 'DZD'

function businessJsonLd(t, code) {
  const { address, hours } = site
  return {
    '@type': 'AutoRental',
    '@id': businessId,
    name: site.name,
    url: `${origin}/`,
    description: t('meta.description'),
    telephone: site.phoneHref,
    email: site.email,
    image: absolute(site.ogImage),
    logo: absolute('logo.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.locality,
      addressRegion: address.region,
      addressCountry: address.country,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: hours.days, opens: hours.opens, closes: hours.closes },
    ],
    areaServed: { '@type': 'City', name: address.region },
    knowsLanguage: languages.map((l) => l.code),
    currenciesAccepted: CURRENCY,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.phoneHref,
      contactType: 'reservations',
      availableLanguage: ['French', 'English', 'Arabic'],
    },
    // Same company, sister service: the VTC site (chauffeur / airport transfers)
    sameAs: [...new Set([...site.sameAs, vtcUrl(code)])],
  }
}

// One schema.org Product (with a daily-rate Offer) per car, so price and availability are machine-readable.
function carJsonLd(car, code, t, url) {
  const name = localize(car.name, code)
  const specs = [
    car.transmission && t(`specs.transmission.${car.transmission}`, { defaultValue: car.transmission }),
    car.seats && t('specs.seats', { count: car.seats }),
    car.fuel && t(`specs.fuel.${car.fuel}`, { defaultValue: car.fuel }),
  ].filter(Boolean)
  return {
    '@type': 'Product',
    '@id': `${url}#car-${car.id}`,
    name,
    description: [name, ...specs].join(' · '),
    category: t(`categories.${car.category}`, { defaultValue: car.category }),
    ...(car.images?.length ? { image: car.images.slice(0, 6) } : car.image ? { image: car.image } : {}),
    offers: {
      '@type': 'Offer',
      url: `${url}#fleet`,
      priceCurrency: CURRENCY,
      price: car.pricePerDay,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: car.pricePerDay,
        priceCurrency: CURRENCY,
        unitCode: 'DAY',
      },
      availability: car.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@id': businessId },
    },
  }
}

function structuredData(t, code, url, cars) {
  const priced = (cars ?? []).filter((c) => c.pricePerDay > 0)
  const graph = [
    businessJsonLd(t, code),
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: `${origin}/`,
      name: site.name,
      inLanguage: languages.map((l) => l.code),
      publisher: { '@id': businessId },
    },
  ]
  if (priced.length) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${url}#fleet`,
      name: t('fleet.title'),
      itemListElement: priced.map((car, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: carJsonLd(car, code, t, url),
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

// Favicons / manifest are declared once, in index.html.
export function buildHead(i18n, cars = null) {
  const t = i18n.t.bind(i18n)
  const code = getLanguage(i18n.language).code
  const url = pageUrl(code)
  const image = absolute(site.ogImage)
  const lang = getLanguage(code)

  const tags = [
    `<title>${esc(t('meta.title'))}</title>`,
    `<meta name="description" content="${esc(t('meta.description'))}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${url}" />`,
    ...languages.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${pageUrl(l.code)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl(defaultLanguage)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(t('meta.ogTitle'))}" />`,
    `<meta property="og:description" content="${esc(t('meta.ogDescription'))}" />`,
    `<meta property="og:locale" content="${lang.og}" />`,
    ...languages.filter((l) => l.code !== code).map((l) => `<meta property="og:locale:alternate" content="${l.og}" />`),
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(t('meta.imageAlt'))}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(t('meta.ogTitle'))}" />`,
    `<meta name="twitter:description" content="${esc(t('meta.ogDescription'))}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${jsonScript(structuredData(t, code, url, cars))}</script>`,
  ]
  return tags.join('\n    ')
}

export function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
}

// One <url> per language page, each listing all its alternates.
export function buildSitemap(lastmod) {
  const alternates = [
    ...languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${pageUrl(l.code)}" />`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(defaultLanguage)}" />`,
  ].join('\n')
  const urls = languages
    .map((l) => `  <url>\n    <loc>${pageUrl(l.code)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n  </url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`
}
