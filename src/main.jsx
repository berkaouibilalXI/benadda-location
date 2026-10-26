import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import AppRoot from './AppRoot.jsx'
import { createI18n, langFromPath } from './i18n'

// The language comes from the URL (/ = French, /en/, /ar/), exactly like in the pre-rendered HTML.
const i18n = createI18n(langFromPath(window.location.pathname))
// The pre-render step embeds the fleet it rendered (window.__CARS__) so hydration starts from identical data
const initialCars = Array.isArray(window.__CARS__) ? window.__CARS__ : null
const app = (
  <React.StrictMode>
    <AppRoot i18n={i18n} initialCars={initialCars} />
  </React.StrictMode>
)

const rootEl = document.getElementById('root')
if (rootEl.firstElementChild) hydrateRoot(rootEl, app)
else createRoot(rootEl).render(app)
