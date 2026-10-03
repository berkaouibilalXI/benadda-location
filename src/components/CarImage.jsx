import { useState } from 'react'
import CarIllustration from './CarIllustration'

// Photo if the car has one (and it loads), drawing otherwise.
export default function CarImage({ car, label, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!car?.image || failed) {
    return <CarIllustration label={label} className={`w-full ${className}`} />
  }
  return (
    <img
      src={car.image}
      alt={label}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`aspect-[3/2] w-full bg-field object-cover ${className}`}
    />
  )
}
