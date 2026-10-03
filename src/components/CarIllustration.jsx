export default function CarIllustration({ label, className = '' }) {
  return (
    <svg viewBox="0 0 300 100" role="img" aria-label={label} className={`h-auto fill-paper ${className}`}>
      <path d="M8 74q2-18 32-24l40-17q28-17 78-17 42 0 68 20l50 10q18 5 18 24v6H8z" />
      <path fill="#000" d="M96 38q24-13 54-13h8v25H84zM170 25q28 2 44 25h-44z" />
      <circle cx="72" cy="76" r="17" fill="#000" />
      <circle cx="72" cy="76" r="10" fill="#E51D23" />
      <circle cx="236" cy="76" r="17" fill="#000" />
      <circle cx="236" cy="76" r="10" fill="#E51D23" />
    </svg>
  )
}
