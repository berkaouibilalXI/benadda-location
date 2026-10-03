import { useEffect } from 'react'
import { BookingProvider } from './context/BookingContext'
import { useCars } from './hooks/useCars'
import { useLang } from './hooks/useLang'
import Header from './components/Header'
import Hero from './components/Hero'
import Fleet from './components/Fleet'
import HowItWorks from './components/HowItWorks'
import Reserve from './components/Reserve'
import Footer from './components/Footer'

export default function App() {
  const { cars, status, reload } = useCars()
  const { t, code, dir } = useLang()

  useEffect(() => {
    document.documentElement.lang = code
    document.documentElement.dir = dir
    document.title = t('meta.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))
  }, [code, dir, t])

  return (
    <BookingProvider cars={cars}>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:inset-s-3 focus:top-3 focus:z-60 focus:bg-brand focus:px-4 focus:py-2"
      >
        {t('common.skip')}
      </a>
      <Header />
      <main id="top">
        <Hero />
        <Fleet cars={cars} status={status} reload={reload} />
        <HowItWorks />
        <Reserve cars={cars} />
      </main>
      {/* <Footer /> */}
    </BookingProvider>
  )
}
