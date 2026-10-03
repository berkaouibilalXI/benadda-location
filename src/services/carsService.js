// Single place that knows where car data comes from.
// Switch source with VITE_CARS_PROVIDER = json | supabase | api  (see .env.example).
// Whatever the source, every car is normalised to the same shape:
// { id, name, category, transmission, seats, fuel, features[], pricePerDay, image, available }

const env = import.meta.env
const provider = env.VITE_CARS_PROVIDER || 'json'

// ---------- helpers ----------
const isAbsolute = (url) => /^(https?:)?\/\//.test(url) || url.startsWith('data:')

function resolveImage(image, { supabase = false } = {}) {
  if (!image) return null
  if (isAbsolute(image)) return image
  if (supabase) {
    return `${env.VITE_SUPABASE_URL}/storage/v1/object/public/${env.VITE_SUPABASE_BUCKET || 'car-images'}/${image}`
  }
  // Local file in /public (works with any Vite `base`)
  return `${env.BASE_URL}${image.replace(/^\//, '')}`
}

function normalizeCar(raw, opts) {
  return {
    id: String(raw.id),
    name: raw.name,
    category: raw.category,
    transmission: raw.transmission ?? null,
    seats: raw.seats ?? null,
    fuel: raw.fuel ?? null,
    features: raw.features ?? [],
    pricePerDay: Number(raw.pricePerDay ?? raw.price_per_day ?? 0),
    image: resolveImage(raw.image, opts),
    available: raw.available !== false,
  }
}

// ---------- providers ----------
async function fromJson() {
  const { default: cars } = await import('../data/cars.json')
  return cars.map((c) => normalizeCar(c))
}

async function fromSupabase() {
  const base = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  if (!base || !key) throw new Error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
  const res = await fetch(`${base}/rest/v1/cars?select=*&order=sort.asc,price_per_day.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  if (!res.ok) throw new Error(`Supabase error ${res.status}`)
  const rows = await res.json()
  return rows.map((r) => normalizeCar(r, { supabase: true }))
}

async function fromApi() {
  const url = env.VITE_CARS_API_URL
  if (!url) throw new Error('Missing VITE_CARS_API_URL')
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  return (Array.isArray(data) ? data : data.cars ?? []).map((c) => normalizeCar(c))
}

const providers = { json: fromJson, supabase: fromSupabase, api: fromApi }

export async function getCars() {
  const load = providers[provider]
  if (!load) throw new Error(`Unknown VITE_CARS_PROVIDER "${provider}"`)
  return load()
}
