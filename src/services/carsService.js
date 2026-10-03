const env = import.meta.env
const provider = env.VITE_CARS_PROVIDER || 'json'

const isAbsolute = (url) => /^(https?:)?\//.test(url) || url.startsWith('data:')

function resolveImage(image, { supabase = false } = {}) {
  if (!image || typeof image !== 'string') return null
  if (isAbsolute(image)) return image
  if (supabase) {
    return `${env.VITE_SUPABASE_URL}/storage/v1/object/public/${env.VITE_SUPABASE_BUCKET || 'car-images'}/${image}`
  }
  return `${env.BASE_URL}${image.replace(/^\//, '')}`
}

function normalizeCar(raw, opts) {
  const toList = (v) => (Array.isArray(v) ? v : v ? [v] : [])
  const rawImages = [...toList(raw.images), ...toList(raw.image)]
  const images = rawImages.map((src) => resolveImage(src, opts)).filter(Boolean)

  return {
    id: String(raw.id),
    name: raw.name,
    category: raw.category,
    transmission: raw.transmission ?? null,
    seats: raw.seats ?? null,
    fuel: raw.fuel ?? null,
    features: raw.features ?? [],
    pricePerDay: Number(raw.pricePerDay ?? raw.price_per_day ?? 0),
    images,
    image: images[0] ?? null,
    available: raw.available !== false,
  }
}

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
