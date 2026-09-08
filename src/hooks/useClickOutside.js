import { useEffect, useEffectEvent } from 'react'

export default function useClickOutside(ref, onOutside, enabled = true) {
  const handleOutside = useEffectEvent(onOutside)

  useEffect(() => {
    if (!enabled) return
    function handlePointerDown(event) {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        handleOutside(event)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [ref, enabled])
}
