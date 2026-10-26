import { useCallback, useEffect, useState } from 'react'
import { carsProvider, getCars } from '../services/carsService'

// `initialCars` comes from the pre-render step (see scripts/prerender.mjs): the fleet is already in the
// HTML that search engines read, and the browser starts from the very same data, so hydration matches.
export function useCars(initialCars = null) {
  const [state, setState] = useState(
    initialCars ? { cars: initialCars, status: 'ready', error: null } : { cars: [], status: 'loading', error: null },
  )

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const cars = await getCars()
      setState((prev) => {
        if (!silent) return { cars, status: 'ready', error: null }
        // Silent refresh: if a photo lookup failed this time, keep the photos that came with the build
        const before = new Map(prev.cars.map((c) => [c.id, c]))
        const merged = cars.map((c) => {
          const old = before.get(c.id)
          return !c.images.length && old?.images.length ? { ...c, images: old.images, image: old.image } : c
        })
        return { cars: merged, status: 'ready', error: null }
      })
    } catch (error) {
      console.error(error)
      // A silent refresh must never replace a fleet that is already on screen by an error message
      if (!silent) setState({ cars: [], status: 'error', error })
    }
  }, [])

  useEffect(() => {
    if (!initialCars) {
      load()
      return
    }
    if (carsProvider === 'json' && !initialCars.some((c) => c.imagesFolder)) return

    // Anything fetched from a remote source (Supabase data, or photos listed from a Supabase folder):
    // quietly refresh, so new photos / prices / availability show up without waiting for the next build.
    // It runs when the browser is idle, so it never competes with the first paint.
    const run = () => load({ silent: true })
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(run, 2000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ...state, reload: () => load() }
}
