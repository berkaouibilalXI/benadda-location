import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { site } from '../config/site'

const HASH = '#vtc'

const VtcContext = createContext(null)
const isOpenHash = () => window.location.hash === HASH

export function VtcProvider({ children }) {
  const [open, setOpen] = useState(isOpenHash)

  // Back / forward buttons and manual hash edits keep the modal in sync with the URL.
  useEffect(() => {
    const sync = () => setOpen(isOpenHash())
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const show = useCallback(() => {
    if (!isOpenHash()) window.history.pushState({ vtc: true }, '', HASH)
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    if (window.history.state?.vtc) {
      // We pushed the entry ourselves: going back removes the hash (popstate then closes it).
      window.history.back()
    } else {
      // Opened from a direct link: just clean the URL, never navigate away from the site.
      if (isOpenHash()) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
      setOpen(false)
    }
  }, [])

  // Open on every page load after the configured delay.
  useEffect(() => {
    const { autoOpen, autoOpenDelayMs } = site.vtc
    if (!autoOpen || isOpenHash()) return
    const id = setTimeout(show, autoOpenDelayMs)
    return () => clearTimeout(id)
  }, [show])

  const value = useMemo(() => ({ open, show, hide }), [open, show, hide])
  return <VtcContext.Provider value={value}>{children}</VtcContext.Provider>
}

export function useVtc() {
  const ctx = useContext(VtcContext)
  if (!ctx) throw new Error('useVtc must be used inside <VtcProvider>')
  return ctx
}