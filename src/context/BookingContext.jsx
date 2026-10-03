import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const BookingContext = createContext(null)

const initial = { name: '', phone: '', carId: '', days: '3', startDate: '', notes: '' }

export function BookingProvider({ cars, children }) {
  const [form, setForm] = useState(initial)

  const setField = useCallback((key, value) => setForm((f) => ({ ...f, [key]: value })), [])

  const car = useMemo(
    () => cars.find((c) => c.id === form.carId && c.available) ?? cars.find((c) => c.available) ?? null,
    [cars, form.carId],
  )

  const selectCar = useCallback((id) => {
    setForm((f) => ({ ...f, carId: id }))
    document.getElementById('reserve')?.scrollIntoView()
  }, [])

  const value = useMemo(() => ({ form, setField, car, selectCar }), [form, setField, car, selectCar])
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>')
  return ctx
}
