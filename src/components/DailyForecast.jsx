import { formatTemperature } from '@/utils/formatWeather'
import { getWeatherCondition } from '@/utils/weatherConditions'


function formatDay(date, options) {
  return new Intl.DateTimeFormat('en', {
    ...options,
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}


function DailyForecast({ days, units }) {
  return (
    <section aria-labelledby="daily-forecast-title" className="min-w-0">
      <h2 id="daily-forecast-title" className="font-heading text-xl font-bold">
        7-day forecast
      </h2>
      {days.length === 0 ? (
        <p className="mt-4 text-slate-400">Daily forecast is currently unavailable.</p>
      ) : (
        <ul className="mt-4 flex snap-x snap-proximity gap-3 overflow-x-auto pb-3 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0 xl:grid-cols-7">
          {days.map((day) => {
            const condition = getWeatherCondition(day.code, 1)
            return (
              <li key={day.date} className="flex w-32 shrink-0 snap-start flex-col items-center rounded-2xl border border-white/5 bg-[#111e32] px-2 py-4 text-center sm:w-auto">
                <time dateTime={day.date}>
                  <span className="block text-sm font-semibold">{formatDay(day.date, { weekday: 'short' })}</span>
                  <span className="mt-1 block text-xs text-slate-400">{formatDay(day.date, { month: 'short', day: 'numeric' })}</span>
                </time>
                <div className="my-2 flex h-16 items-center">
                  {condition.icon && (
                    <img src={condition.icon} alt="" width="64" height="64" className={`h-16 w-16 object-contain ${condition.icon.endsWith('half-moon.png') ? 'scale-[0.65]' : ''}`} />
                  )}
                </div>
                <p className="mb-4 text-xs leading-relaxed text-slate-400">{condition.description}</p>
                <dl className="mt-auto flex w-full flex-wrap justify-around gap-x-2 gap-y-3 tabular-nums">
                  <div>
                    <dt className="text-xs text-slate-400">High</dt>
                    <dd className="mt-1 text-lg font-semibold">{formatTemperature(day.max, units)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-400">Low</dt>
                    <dd className="mt-1 text-lg text-slate-300">{formatTemperature(day.min, units)}</dd>
                  </div>
                </dl>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default DailyForecast
