
export const site = {
  name: 'Benadda DreamCar',
  url: 'https://benadda-dreamcar.com',
  phoneDisplay: '07 92 21 03 97',
  phoneHref: '+213792210397',
  email: 'benaddadreamcar@gmail.com',
  whatsappNumber: '213792210397',
  // Keep this identical to the Google Business Profile address and to the VTC site (NAP consistency)
  address: { street: 'Akid Lotfi', locality: 'Bir El Djir', region: 'Oran', country: 'DZ' },
  hours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '21:00',
  },
  ogImage: 'og-image.jpg',
  // Verified social profile URLs, e.g. ['https://www.facebook.com/...', 'https://www.instagram.com/...']
  sameAs: ["https://www.instagram.com/benaddadreamcar"],
  defaultLanguage: 'fr',
  whatsappLanguage: null,
  maxDays: 90,
  vtc: {
    url: 'https://vtc-oran.benadda-dreamcar.com/',
    // A full-screen pop-up a few seconds after landing counts as an "intrusive interstitial" for Google
    // (mobile ranking). The "VTC — Nouveau" nav link and the footer link already promote the service.
    autoOpen: false,
    autoOpenDelayMs: 3000,
    rememberDays: 7,
  },
}

// The VTC site has the same three languages: / (fr), /en/, /ar/
export const vtcUrl = (code) => (code === site.defaultLanguage ? site.vtc.url : `${site.vtc.url.replace(/\/$/, '')}/${code}/`)
