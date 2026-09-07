import { useEffect, useId, useRef, useState } from 'react'

function Dropdown({ label, value, options, onChange, showLabel = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef(null)
  const optionRefs = useRef([])
  const searchRef = useRef({ text: '', time: 0 })
  const id = useId()
  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = options[selectedIndex]
  const active = Math.min(activeIndex, Math.max(options.length - 1, 0))

  useEffect(() => {
    if (!isOpen) return
    function handleOutside(event) {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) optionRefs.current[active]?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, active])

  function openMenu() {
    setActiveIndex(Math.max(selectedIndex, 0))
    setIsOpen(true)
  }

  function choose(index) {
    if (!options[index]) return
    onChange(options[index].value)
    setIsOpen(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      if (isOpen) { event.preventDefault(); event.stopPropagation() }
      setIsOpen(false)
    } else if (event.key === 'Tab') {
      setIsOpen(false)
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      if (!isOpen) {
        openMenu()
        if (event.key === 'Home') setActiveIndex(0)
        if (event.key === 'End') setActiveIndex(options.length - 1)
      } else {
        setActiveIndex(event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 :
          Math.max(0, Math.min(options.length - 1, active + (event.key === 'ArrowDown' ? 1 : -1))))
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (isOpen) choose(active)
      else openMenu()
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now()
      const text = (now - searchRef.current.time < 600 ? searchRef.current.text : '') + event.key.toLowerCase()
      searchRef.current = { text, time: now }
      const match = options.findIndex((option) => option.label.toLowerCase().startsWith(text))
      if (match !== -1) { event.preventDefault(); setActiveIndex(match); setIsOpen(true) }
    }
  }

  return (
    <div ref={rootRef} className="relative w-full" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
    }}>
      <span id={`${id}-label`} className={showLabel ? 'mb-2 block text-xs font-medium text-slate-400' : 'sr-only'}>{label}</span>
      <button
        type="button"
        role="combobox"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-list`}
        aria-activedescendant={isOpen && options.length ? `${id}-option-${active}` : undefined}
        disabled={!options.length}
        onClick={() => { if (isOpen) setIsOpen(false); else openMenu() }}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left text-sm text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:opacity-50 ${isOpen ? 'border-sky-400/60 bg-[#20354f]' : 'border-white/10 bg-[#192b43] hover:border-sky-300/30 hover:bg-[#20354f]'}`}
      >
        <span id={`${id}-value`} className="truncate">{selected?.label || 'Choose an option'}</span>
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={`h-4 w-4 shrink-0 text-sky-300 transition-transform motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}>
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <ul id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className="absolute inset-x-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-sky-300/20 bg-[#14243a] p-1.5 shadow-2xl shadow-black/40 [scrollbar-color:#334155_transparent]">
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              ref={(element) => { optionRefs.current[index] = element }}
              role="option"
              aria-selected={option.value === value}
              onPointerMove={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm ${active === index ? 'bg-sky-400/15 text-white' : 'text-slate-300'} ${option.value === value ? 'font-semibold text-sky-300' : ''}`}
            >
              <span>{option.label}</span>
              {option.value === value && <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-sky-300"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
