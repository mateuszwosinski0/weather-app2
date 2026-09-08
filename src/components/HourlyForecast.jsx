import { Umbrella } from 'lucide-react'
import { getLocalForecastTime } from '@/utils/localForecastTime'
import Dropdown from '@/components/Dropdown'
import { formatTemperature } from '@/utils/formatWeather'
import { Fragment, useEffect, useRef, useState } from 'react'
import { getWeatherCondition } from '@/utils/weatherConditions'
import { selectForecastHours } from '@/utils/forecastHours'

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function HourlyForecast({ hours, currentTime, timeZone, units }) {
  const [now, setNow] = useState(() => new Date())
  const listRef = useRef(null)
  const localTime = getLocalForecastTime(timeZone, now) || currentTime
  const currentHourKey = localTime?.slice(0, 13)
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(tick)
  }, [])
  const dates = [...new Set(hours.map((hour) => hour.time.slice(0, 10)))]
    .filter((date) => !localTime || date >= localTime.slice(0, 10))
  const [selectedDate, setSelectedDate] = useState('next-24')
  const activeDate = dates.includes(selectedDate) ? selectedDate : 'next-24'
  const visibleHours = selectForecastHours(hours, activeDate, localTime)
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0
  }, [activeDate, currentHourKey])

  return (
    <section aria-labelledby="hourly-forecast-title" className="flex min-h-0 min-w-0 flex-col overflow-hidden xl:absolute xl:inset-0 rounded-3xl border border-white/5 bg-[#111e32] p-5 sm:p-6">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="hourly-forecast-title" className="font-heading text-xl font-bold">Hourly forecast</h2>
          <p className="mt-1 text-sm text-slate-400">Local time · Selected city</p>
        </div>
        {dates.length > 0 && (
          <div className="w-full">
            <Dropdown
              label="Period"
              showLabel
              value={activeDate}
              options={[{ value: 'next-24', label: 'Next 24 hours' }, ...dates.map((date) => ({ value: date, label: formatDate(date) }))]}
              onChange={setSelectedDate}
            />
          </div>
        )}
      </div>
      {visibleHours.length === 0 ? (
        <p role="status" className="mt-6 text-slate-400">No hourly forecast available for this period.</p>
      ) : (
        <ul ref={listRef} className="mt-5 min-h-0 max-h-[34rem] space-y-2 overflow-y-auto pr-1 xl:max-h-none xl:flex-1 [scrollbar-color:#334155_transparent]">
          {visibleHours.map((hour, index) => {
            const condition = getWeatherCondition(hour.code, hour.isDay)
            const date = hour.time.slice(0, 10)
            const startsDay = index === 0 || date !== visibleHours[index - 1].time.slice(0, 10)
            return (
              <Fragment key={hour.time}>
              {activeDate === 'next-24' && startsDay && (
                <li className="px-1 pb-1 pt-2 text-xs font-medium text-sky-300"><time dateTime={date}>{formatDate(date)}</time></li>
              )}
              <li className="grid grid-cols-[3rem_2.5rem_minmax(0,1fr)_auto] items-center gap-x-2 rounded-xl bg-[#192b43]/70 px-3 py-3">
                <div className="contents">
                  <time dateTime={hour.time} className="text-sm font-medium tabular-nums">{hour.time.slice(11, 16)}</time>
                  <div className="h-10 w-10">{condition.icon && <img src={condition.icon} alt="" width="40" height="40" className={`h-10 w-10 object-contain ${condition.icon.endsWith("half-moon.png") ? "scale-[0.65]" : ""}`} />}</div>
                  <span className="col-start-4 row-start-1 text-lg font-semibold tabular-nums">
                    {formatTemperature(hour.temperature, units)}
                  </span>
                </div>
                <p className="col-span-3 col-start-2 row-start-2 text-xs text-slate-400">{condition.description}</p>
                <p className="col-start-3 row-start-1 text-xs text-sky-300">
                  <span className="sr-only">Chance of precipitation: </span><Umbrella aria-hidden="true" className="mr-1 inline h-3.5 w-3.5" />{Number.isFinite(hour.precipitationProbability) ? `${hour.precipitationProbability}%` : '—'}
                </p>
              </li>
              </Fragment>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default HourlyForecast
