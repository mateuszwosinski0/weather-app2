import { LoaderCircle, LocateFixed, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getDeviceLocation } from '@/services/geolocation'
import useClickOutside from '@/hooks/useClickOutside'

function LocationButton({ onCitySelect, onBusyChange, disabled }) {
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState('')
  const mounted = useRef(true)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)

  useClickOutside(rootRef, () => setError(''), Boolean(error))

  function dismissError() {
    setError('')
    buttonRef.current?.focus()
  }

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
    <div ref={rootRef} className="relative shrink-0" onKeyDown={(event) => {
      if (event.key === 'Escape' && error) {
        event.preventDefault()
        event.stopPropagation()
        dismissError()
      }
    }}>
      <button
        ref={buttonRef}
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
          <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" />
        ) : (
          <LocateFixed aria-hidden="true" className="h-5 w-5" />
        )}
      </button>
      {isLocating && <p role="status" className="sr-only">Waiting for your location...</p>}
      {error && (
        <div className="absolute right-0 top-full z-20 mt-2 flex w-64 items-start gap-2 rounded-xl border border-red-400/30 bg-[#14243a] p-3 text-sm text-red-300 shadow-xl">
          <p id="location-error" role="alert" className="min-w-0 flex-1">{error}</p>
          <button type="button" onClick={dismissError} aria-label="Dismiss location error" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-red-400/15 focus-visible:outline-2 focus-visible:outline-red-300">
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default LocationButton
