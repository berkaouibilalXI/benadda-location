import { useCallback, useEffect, useState } from 'react'
import { getCars } from '../services/carsService'

export function useCars() {
  const [state, setState] = useState({ cars: [], status: 'loading', error: null })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const cars = await getCars()
      setState({ cars, status: 'ready', error: null })
    } catch (error) {
      console.error(error)
      setState({ cars: [], status: 'error', error })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, reload: load }
}
