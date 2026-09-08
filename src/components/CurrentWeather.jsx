import { Star, ArrowUpRight, RefreshCw } from 'lucide-react'
import { formatTemperature, formatWind, formatPrecipitation } from '@/utils/formatWeather'
import { getWeatherCondition } from '@/utils/weatherConditions'

function CurrentWeather({ city, weather, units, onShowChart, onRefresh, isRefreshing, fetchedAt, refreshError, isFavorite, onToggleFavorite }) {
  function formatValue(value, unit) {
    return Number.isFinite(value) ? `${value}${unit}` : '—'
  }

  const condition = getWeatherCondition(weather.weather_code, weather.is_day)

  const details = [
    { label: 'Feels like', value: formatTemperature(weather.apparent_temperature, units) },
    { label: 'Humidity', value: formatValue(weather.relative_humidity_2m, '%') },
    { label: 'Wind', value: formatWind(weather.wind_speed_10m, units) },
    { label: 'Precipitation', value: formatPrecipitation(weather.precipitation, units) },
  ]

  return (
    <section aria-label="Current weather" className="overflow-hidden rounded-3xl border border-sky-300/15 bg-linear-to-br from-sky-900/70 via-[#132c47] to-[#111d33] p-6 shadow-xl shadow-black/10 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Current weather</p>
          <div className="mt-3 flex items-center gap-2">
            <h2 className="min-w-0 break-words font-heading text-3xl font-bold sm:text-4xl">{city.name}</h2>
            {city.source !== 'geolocation' && (
              <button type="button" onClick={onToggleFavorite} aria-pressed={isFavorite} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'} title={isFavorite ? 'Remove from favorites' : 'Add to favorites'} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sky-300 hover:bg-sky-300/10 focus-visible:outline-2 focus-visible:outline-sky-400">
                <Star aria-hidden="true" className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
          <p className="mt-1 text-slate-400">
            {[city.admin1, city.country].filter(Boolean).join(', ')}
          </p>
        </div>
        <div className="grid grid-cols-[5rem_auto] items-center justify-items-center gap-x-3 gap-y-2 sm:grid-cols-[6rem_auto] sm:gap-x-4">
          <div className="col-start-1 row-start-1">
            {condition.icon && (
              <img
                src={condition.icon}
                alt=""
                width="96"
                height="96"
                className={`h-20 w-20 object-contain sm:h-24 sm:w-24 ${condition.icon.endsWith('half-moon.png') ? 'scale-[0.7]' : ''}`}
              />
            )}
          </div>
            <p className="col-start-2 row-start-1 text-6xl font-medium tracking-tighter sm:text-7xl">
              {formatTemperature(weather.temperature_2m, units)}
            </p>
          <p className="col-start-1 row-start-2 text-center text-slate-300">{condition.description}</p>
          <button type="button" onClick={onShowChart} aria-haspopup="dialog" className="col-start-2 row-start-2 inline-flex items-center gap-1.5 rounded-md py-1 text-sm font-medium text-sky-300 underline-offset-4 hover:text-sky-100 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400">
            View chart <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {details.map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-slate-950/25 p-4">
            <dt className="text-sm text-slate-400">{label}</dt>
            <dd className="mt-2 text-xl font-medium tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <p role="status" className="text-xs text-slate-400">
          {isRefreshing ? 'Refreshing weather...' : (
            <>Updated at <time dateTime={fetchedAt} title="Time of the last successful fetch, in your device's time zone">
              {new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(fetchedAt))}
            </time> · Your local time</>
          )}
        </p>
        <button type="button" onClick={onRefresh} disabled={isRefreshing} className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-sky-300 hover:bg-sky-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-wait disabled:opacity-50">
          <RefreshCw aria-hidden="true" className={`h-4 w-4 ${isRefreshing ? 'animate-spin motion-reduce:animate-none' : ''}`} /> {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {refreshError && <p role="alert" className="mt-3 text-sm text-red-300">Could not refresh the forecast. Showing the last loaded data. Please try again.</p>}
     
    </section>
  )
}

export default CurrentWeather
