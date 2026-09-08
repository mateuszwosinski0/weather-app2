import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { formatTemperature } from '@/utils/formatWeather'
import { getChartHours } from '@/utils/temperatureChart'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function formatTime(time) {
  return new Intl.DateTimeFormat('en', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC',
  }).format(new Date(`${time}Z`))
}

function TemperatureChartModal({ hours, currentTime, city, units, onClose }) {
  const dialogRef = useRef(null)
  const backdropPressed = useRef(false)
  const titleId = useId()
  const descriptionId = useId()
  const gradientId = useId()
  const chartHours = getChartHours(hours, currentTime)
  const chartData = chartHours.map((hour) => ({
    time: hour.time,
    temperature: Number.isFinite(hour.temperature)
      ? (units === 'imperial' ? hour.temperature * 9 / 5 + 32 : hour.temperature)
      : null,
  }))
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
      onPointerDown={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        backdropPressed.current = event.target === event.currentTarget &&
          (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
      }}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
        if (backdropPressed.current && event.target === event.currentTarget && outside) onClose()
        backdropPressed.current = false
      }}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-3xl border border-sky-300/15 bg-[#101e32] p-5 text-white shadow-2xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-sm sm:inset-0 sm:m-auto sm:max-h-[85dvh] sm:w-[calc(100%-3rem)] sm:max-w-3xl sm:rounded-3xl sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Temperature forecast</p>
          <h2 id={titleId} className="mt-2 break-words font-heading text-2xl font-bold sm:text-3xl">{city.name}</h2>
          <p id={descriptionId} className="mt-2 text-sm text-slate-400">Next 24 hours · Local time in the selected location</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close temperature chart" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-800 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-sky-400"><X aria-hidden="true" className="h-5 w-5" /></button>
      </div>
      {!validHours.length ? (
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
          <div className="mt-5 h-72 min-w-0 rounded-2xl border border-white/5 bg-slate-950/20 p-2 sm:h-80">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={chartData} margin={{ top: 16, right: 16, bottom: 8, left: 0 }} accessibilityLayer>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 5" />
                <XAxis dataKey="time" tickFormatter={(time) => time.slice(11, 16)} stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={32} />
                <YAxis width={48} domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(value) => Math.round(value) + '°'} stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  labelFormatter={formatTime}
                  formatter={(value) => [Math.round(value) + (units === 'imperial' ? '°F' : '°C'), 'Temperature']}
                  contentStyle={{ background: '#0b1526', border: '1px solid #38bdf880', borderRadius: 12, color: '#cbd5e1' }}
                  itemStyle={{ color: '#7dd3fc' }}
                  cursor={{ stroke: '#7dd3fc', strokeDasharray: '4 4', strokeOpacity: 0.4 }}
                  isAnimationActive={false}
                />
                <Area type="monotone" dataKey="temperature" stroke="#38bdf8" strokeWidth={3} fill={`url(#${gradientId})`} baseValue="dataMin" connectNulls={false} dot={chartData.length === 1} activeDot={{ r: 5, fill: '#f8fafc', stroke: '#38bdf8', strokeWidth: 2 }} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-400">Hover over the chart or tap a point to see its temperature.</p>

        </>
      )}
    </dialog>,
    document.body
  )
}

export default TemperatureChartModal
