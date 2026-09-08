import { useState } from 'react'

export default function useListNavigation({ count, onSelect, onNavigate, loop = false, isOpen = true, onOpen, initialIndex = 0, openOnSelect = true }) {
  const [index, setActiveIndex] = useState(-1)
  const activeIndex = count ? Math.min(index, count - 1) : -1

  function handleKeyDown(event, { currentIndex = activeIndex, allowHomeEnd = true, selectOnSpace = false } = {}) {
    if (event.nativeEvent?.isComposing || event.ctrlKey || event.metaKey || event.altKey) return false
    const direction = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
    const boundary = allowHomeEnd && ['Home', 'End'].includes(event.key)
    const select = event.key === 'Enter' || (selectOnSpace && event.key === ' ')
    if (!direction && !boundary && !select) return false
    if (!isOpen) {
      if (!onOpen || (select && !openOnSelect)) return false
      event.preventDefault()
      const next = boundary ? (event.key === 'Home' ? 0 : count - 1) : initialIndex
      setActiveIndex(count ? Math.max(0, Math.min(count - 1, next)) : -1)
      onOpen()
      return true
    }
    if (!count || (select && (currentIndex < 0 || currentIndex >= count))) return false
    event.preventDefault()
    if (select) {
      onSelect(currentIndex)
      return true
    }
    let next = boundary ? (event.key === 'Home' ? 0 : count - 1)
      : currentIndex < 0 ? (direction > 0 ? 0 : count - 1) : currentIndex + direction
    next = loop ? (next + count) % count : Math.max(0, Math.min(count - 1, next))
    setActiveIndex(next)
    onNavigate?.(next)
    return true
  }

  return { activeIndex, setActiveIndex, handleKeyDown }
}
