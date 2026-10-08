import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { site } from '../config/site'

// The modal behaves like a sub-page: it lives at the URL hash "#vtc".
//  - the link /#vtc opens it directly (shareable)
//  - opening pushes a history entry, so the browser Back button closes it
//  - closing removes the hash again
const HASH = '#vtc'
const SEEN_KEY = 'vtc-popup-seen'
const DAY = 24 * 60 * 60 * 1000

const VtcContext = createContext(null)
const isOpenHash = () => window.location.hash === HASH

export function VtcProvider({ children }) {
  const [open, setOpen] = useState(false)

  // Deep link (/#vtc) is read after mount; back / forward buttons and hash edits keep it in sync.
  useEffect(() => {
    setOpen(isOpenHash())
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

  // Remember that the visitor has seen it, however it was opened.
  useEffect(() => {
    if (!open) return
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()))
    } catch {
      /* storage blocked: it will simply pop up again next time */
    }
  }, [open])

  // Pop up once after a short delay, unless seen recently or the visitor is typing in the form.
  useEffect(() => {
    const { autoOpen, autoOpenDelayMs, rememberDays } = site.vtc
    if (!autoOpen || isOpenHash()) return
    let last = 0
    try {
      last = Number(localStorage.getItem(SEEN_KEY)) || 0
    } catch {
      /* ignore */
    }
    if (Date.now() - last < rememberDays * DAY) return
    const id = setTimeout(() => {
      if (document.activeElement?.matches?.('input, select, textarea')) return
      show()
    }, autoOpenDelayMs)
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