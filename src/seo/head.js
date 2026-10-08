import { site } from '../config/site'
import { defaultLanguage, getLanguage, languages, pathFor } from '../i18n'

const origin = site.url.replace(/\/$/, '')
export const pageUrl = (code) => origin + pathFor(code)
const absolute = (path) => `${origin}/${path.replace(/^\//, '')}`

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Safe to embed inside <script type="application/ld+json">
const jsonScript = (data) => JSON.stringify(data).replace(/</g, '\\u003c')

function businessJsonLd(t) {
  const { address, hours } = site
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    '@id': `${origin}/#business`,
    name: site.name,
    url: `${origin}/`,
    description: t('meta.description'),
    telephone: site.phoneHref,
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
    areaServed: { '@type': 'City', name: address.locality },
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  }
}

export function buildHead(i18n) {
  const t = i18n.t.bind(i18n)
  const code = getLanguage(i18n.language).code
  const url = pageUrl(code)
  const image = absolute(site.ogImage)
  const lang = getLanguage(code)

  const tags = [
    `<title>${esc(t('meta.title'))}</title>`,
    `<meta name="description" content="${esc(t('meta.description'))}" />`,
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
    `<script type="application/ld+json">${jsonScript(businessJsonLd(t))}</script>`,
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
