import { I18nextProvider } from 'react-i18next'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'

// Everything the app needs around <App />, shared by the browser and the pre-render step.
export default function AppRoot({ i18n }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </I18nextProvider>
  )
}
