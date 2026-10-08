// Used only at build time by scripts/prerender.mjs (never shipped to the browser).
import { renderToString } from 'react-dom/server'
import AppRoot from './AppRoot.jsx'
import { createI18n, getLanguage, languages } from './i18n'
import { buildHead, buildRobots, buildSitemap } from './seo/head.js'

export { languages, buildRobots, buildSitemap }

export function render(lng) {
  const i18n = createI18n(lng)
  const html = renderToString(<AppRoot i18n={i18n} />)
  const { dir } = getLanguage(lng)
  return { html, head: buildHead(i18n), lang: lng, dir }
}
