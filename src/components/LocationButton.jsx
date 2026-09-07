import { useEffect, useRef, useState } from 'react'
import { getDeviceLocation } from '@/services/geolocation'

function LocationButton({ onCitySelect, onBusyChange, disabled }) {
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState('')
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  async function handleLocation() {
    if (disabled || isLocating) return
    setError('')
    setIsLocating(true)
    onBusyChange(true)
    try {
      const location = await getDeviceLocation()
      if (mounted.current) onCitySelect(location)
    } catch (error) {
      if (mounted.current) setError(error.message)
    } finally {
      if (mounted.current) {
        setIsLocating(false)
        onBusyChange(false)
      }
    }
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={handleLocation}
        disabled={disabled || isLocating}
        aria-label={isLocating ? 'Finding your location' : 'Use my location'}
        title={isLocating ? 'Finding your location...' : 'Use my location'}
        aria-busy={isLocating}
        aria-describedby={error ? 'location-error' : undefined}
        className="flex h-[50px] w-[50px] items-center justify-center rounded-xl border border-white/10 bg-[#192b43] text-sky-300 transition-colors hover:border-sky-400/40 hover:bg-sky-400/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLocating ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin motion-reduce:animate-none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" opacity="0.25" />
            <path d="M12 4a8 8 0 0 1 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <path d="M12 2v3m0 14v3M2 12h3m14 0h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        )}
      </button>
      {isLocating && <p role="status" className="sr-only">Waiting for your location...</p>}
      {error && <p id="location-error" role="alert" className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-red-400/30 bg-[#14243a] p-3 text-sm text-red-300 shadow-xl">{error}</p>}
    </div>
  )
}

export default LocationButton
