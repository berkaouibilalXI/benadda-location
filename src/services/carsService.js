// Single place that knows where car data and car photos come from.
//
// Car data:   VITE_CARS_PROVIDER = json | supabase | api   (see .env.example)
// Car photos: any of these, per car (first one that is set wins):
//   "images": ["cars/a.jpg", "https://.../b.jpg"]   explicit list (local /public file, full URL or bucket path)
//   "imagesFolder": "Doblo/Grise"                    every image in that folder of the Supabase bucket, listed automatically
//
// Every car is normalised to:
// { id, name, category, transmission, seats, fuel, features[], color, colorName, pricePerDay, images[], image, available }

const env = import.meta.env
const provider = env.VITE_CARS_PROVIDER || 'json'

// ---------- Supabase Storage helpers ----------
const SUPABASE_URL = env.VITE_SUPABASE_URL
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY // anon JWT or the newer "publishable" key
const BUCKET = env.VITE_SUPABASE_BUCKET || 'car-images'
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i

// Old anon keys are JWTs and go in Authorization too; new publishable keys only go in `apikey`.
const authHeaders = () => ({
  apikey: SUPABASE_KEY,
  ...(SUPABASE_KEY?.startsWith('eyJ') ? { Authorization: `Bearer ${SUPABASE_KEY}` } : {}),
})

// Folder and file names with spaces/accents must be URL-encoded, segment by segment.
const encodePath = (path) => path.split('/').map(encodeURIComponent).join('/')

const storagePublicUrl = (path) =>
  `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(BUCKET)}/${encodePath(path)}`

async function listFolder(folder) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
  const prefix = folder.replace(/^\/+|\/+$/g, '')
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${encodeURIComponent(BUCKET)}`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix, limit: 100, sortBy: { column: 'name', order: 'asc' } }),
  })
  if (!res.ok) throw new Error(`Storage list "${prefix}" failed (${res.status})`)
  const entries = await res.json()
  // Sub-folders come back with id === null; only keep real image files.
  return entries
    .filter((e) => e.id && IMAGE_EXT.test(e.name))
    .map((e) => storagePublicUrl(`${prefix}/${e.name}`))
}

// ---------- normalisation ----------
const isAbsolute = (url) => /^(https?:)?\/\//.test(url) || url.startsWith('data:')

function resolveImage(image, { supabase = false } = {}) {
  if (!image || typeof image !== 'string') return null
  if (isAbsolute(image)) return image
  if (supabase) return storagePublicUrl(image)
  // Local file in /public (works with any Vite `base`)
  return `${env.BASE_URL}${image.replace(/^\//, '')}`
}

function normalizeCar(raw, opts) {
  // Accepts `images` or `image`, each either a single string or a list. Duplicates are removed.
  const toList = (v) => (Array.isArray(v) ? v : v ? [v] : [])
  const rawImages = [...toList(raw.images), ...toList(raw.image)]
  const images = [...new Set(rawImages.map((src) => resolveImage(src, opts)).filter(Boolean))]
  return {
    id: String(raw.id),
    name: raw.name,
    category: raw.category,
    transmission: raw.transmission ?? null,
    seats: raw.seats ?? null,
    fuel: raw.fuel ?? null,
    features: raw.features ?? [],
    color: raw.color ?? raw.colorHex ?? raw.color_hex ?? null, // any CSS colour: "#c1121f", "crimson"...
    colorName: raw.colorName ?? raw.color_name ?? null, // optional label, string or { en, fr, ar }
    pricePerDay: Number(raw.pricePerDay ?? raw.price_per_day ?? 0),
    imagesFolder: raw.imagesFolder ?? raw.images_folder ?? null,
    images,
    image: images[0] ?? null,
    available: raw.available !== false,
  }
}

// Fills `images` from the bucket folder for cars that have a folder but no explicit list.
// One request per folder, in parallel. A failing folder only affects that car (it keeps the drawing).
async function withFolderImages(cars) {
  return Promise.all(
    cars.map(async (car) => {
      if (car.images.length || !car.imagesFolder) return car
      try {
        const images = await listFolder(car.imagesFolder)
        return { ...car, images, image: images[0] ?? null }
      } catch (error) {
        console.warn(`[cars] photos for "${car.id}" not loaded:`, error.message)
        return car
      }
    }),
  )
}

// ---------- providers ----------
async function fromJson() {
  const { default: cars } = await import('../data/cars.json')
  return cars.map((c) => normalizeCar(c))
}

async function fromSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/cars?select=*&order=sort.asc,price_per_day.asc`, {
    headers: authHeaders(),
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
  return withFolderImages(await load())
}