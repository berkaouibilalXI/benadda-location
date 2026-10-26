// Used only at build time by scripts/prerender.mjs (never shipped to the browser).
import { renderToString } from 'react-dom/server'
import AppRoot from './AppRoot.jsx'
import { createI18n, getLanguage, languages } from './i18n'
import { buildHead, buildRobots, buildSitemap } from './seo/head.js'
import { getCars } from './services/carsService'

export { languages, buildRobots, buildSitemap, getCars }

// `cars` = the fleet loaded once at build time. Rendering it here puts the cars (names, specs, daily
// rates, photos) in the static HTML and in the JSON-LD instead of an empty "loading" skeleton.
export function render(lng, cars = null) {
  const i18n = createI18n(lng)
  const html = renderToString(<AppRoot i18n={i18n} initialCars={cars} />)
  const { dir } = getLanguage(lng)
  return { html, head: buildHead(i18n, cars), lang: lng, dir }
}
