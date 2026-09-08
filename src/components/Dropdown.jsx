import { ChevronDown, Check } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import useClickOutside from '@/hooks/useClickOutside'
import useListNavigation from '@/hooks/useListNavigation'

function Dropdown({ label, value, options, onChange, showLabel = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef(null)
  const optionRefs = useRef([])
  const searchRef = useRef({ text: '', time: 0 })
  const id = useId()
  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = options[selectedIndex]
  const { activeIndex: active, setActiveIndex, handleKeyDown: navigateList } = useListNavigation({
    count: options.length,
    onSelect: choose,
    isOpen,
    onOpen: () => setIsOpen(true),
    initialIndex: selectedIndex,
  })

  useClickOutside(rootRef, () => setIsOpen(false), isOpen)

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
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Escape') {
      if (isOpen) { event.preventDefault(); event.stopPropagation() }
      setIsOpen(false)
    } else if (event.key === 'Tab') {
      setIsOpen(false)
    } else if (navigateList(event, { selectOnSpace: true })) {
      return
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
        <ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-sky-300 transition-transform motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`} />
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
              {option.value === value && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-sky-300" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
