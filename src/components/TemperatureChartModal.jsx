import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatTemperature } from '@/utils/formatWeather'
import { getChartHours, getChartGeometry } from '@/utils/temperatureChart'

function formatTime(time) {
  return new Intl.DateTimeFormat('en', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC',
  }).format(new Date(`${time}Z`))
}

function TemperatureChartModal({ hours, currentTime, city, units, onClose }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()
  const [selectedIndex, setSelectedIndex] = useState(null)
  const pointRefs = useRef([])
  const chartHours = getChartHours(hours, currentTime)
  const geometry = getChartGeometry(chartHours, units)
  const selected = chartHours[selectedIndex]
  const point = geometry?.points[selectedIndex]
  const tooltipX = point ? Math.max(58, Math.min(point.x - 75, 558)) : 0
  const tooltipY = point ? (point.y < 105 ? point.y + 18 : point.y - 78) : 0
  const validHours = chartHours.filter((hour) => Number.isFinite(hour.temperature))

  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [])

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-3xl border border-sky-300/15 bg-[#101e32] p-5 text-white shadow-2xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-sm sm:inset-0 sm:m-auto sm:max-h-[85dvh] sm:w-[calc(100%-3rem)] sm:max-w-3xl sm:rounded-3xl sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Temperature forecast</p>
          <h2 id={titleId} className="mt-2 break-words font-heading text-2xl font-bold sm:text-3xl">{city.name}</h2>
          <p id={descriptionId} className="mt-2 text-sm text-slate-400">Next 24 hours · Local time in the selected location</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close temperature chart" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-800 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-sky-400"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
      </div>
      {!geometry ? (
        <p role="status" className="py-12 text-slate-300">Temperature forecast is currently unavailable.</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-950/30 p-4">
              <p className="text-xs text-slate-400">Lowest</p>
              <p className="mt-1 text-2xl font-semibold">{formatTemperature(Math.min(...validHours.map((hour) => hour.temperature)), units)}</p>
            </div>
            <div className="rounded-2xl bg-sky-400/10 p-4">
              <p className="text-xs text-sky-200">Highest</p>
              <p className="mt-1 text-2xl font-semibold text-sky-300">{formatTemperature(Math.max(...validHours.map((hour) => hour.temperature)), units)}</p>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/20 p-2">
            <svg viewBox="0 0 740 290" role="group" aria-label="Hourly temperature chart. Use Tab and arrow keys to explore points." onPointerLeave={(event) => { if (event.pointerType === 'mouse') setSelectedIndex(null) }} className="h-auto w-full min-w-[440px]">
              {[0, 1, 2, 3, 4].map((index) => {
                const y = 30 + index * 52.5
                const value = geometry.high - index * (geometry.high - geometry.low) / 4
                return <g key={index}>
                  <line x1="56" x2="712" y1={y} y2={y} stroke="#334155" strokeDasharray="3 5" />
                  <text x="46" y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="12">{Math.round(value)}°</text>
                </g>
              })}
              <path d={geometry.path} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              {geometry.points.map((point, index) => point.y === null ? null : (
                <g key={chartHours[index].time}>
                  <circle cx={point.x} cy={point.y} r={index === selectedIndex ? 6 : 3} fill={index === selectedIndex ? '#f8fafc' : '#38bdf8'} />
                  <rect
                    ref={(element) => { pointRefs.current[index] = element }}
                    x={point.x - 12} y="20" width="24" height="230"
                    fill="transparent" role="button" tabIndex={0}
                    aria-label={formatTime(chartHours[index].time) + ', ' + formatTemperature(chartHours[index].temperature, units)}
                    className="cursor-crosshair outline-none focus:stroke-sky-300/40"
                    onPointerEnter={() => setSelectedIndex(index)}
                    onPointerMove={() => setSelectedIndex(index)}
                    onClick={() => setSelectedIndex(index)}
                    onFocus={() => setSelectedIndex(index)}
                    onBlur={() => setSelectedIndex(null)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedIndex(index)
                      }
                      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                        event.preventDefault()
                        const direction = event.key === 'ArrowRight' ? 1 : -1
                        let target = index + direction
                        while (target >= 0 && target < chartHours.length) {
                          if (pointRefs.current[target]) { pointRefs.current[target].focus(); break }
                          target += direction
                        }
                      }
                    }}
                  />
                </g>
              ))}
              {chartHours.map((hour, index) => (index % 6 === 0 || index === chartHours.length - 1) && (
                <text key={hour.time} x={geometry.points[index].x} y="269" textAnchor="middle" fill="#94a3b8" fontSize="12">{hour.time.slice(11, 16)}</text>
              ))}
              {selected && point?.y != null && (
                <g pointerEvents="none" aria-hidden="true">
                  <line x1={point.x} x2={point.x} y1="30" y2="240" stroke="#7dd3fc" strokeOpacity="0.35" strokeDasharray="4 4" />
                  <rect x={tooltipX} y={tooltipY} width="154" height="64" rx="10" fill="#0b1526" stroke="#38bdf8" strokeOpacity="0.55" />
                  <text x={tooltipX + 12} y={tooltipY + 23} fill="#cbd5e1" fontSize="12">{formatTime(selected.time)}</text>
                  <text x={tooltipX + 12} y={tooltipY + 48} fill="#7dd3fc" fontSize="20" fontWeight="600">{formatTemperature(selected.temperature, units)}</text>
                </g>
              )}
            </svg>
          </div>
          <p className="mt-3 text-xs text-slate-400">Hover over the chart or tap a point to see its temperature.</p>

        </>
      )}
    </dialog>,
    document.body
  )
}

export default TemperatureChartModal
