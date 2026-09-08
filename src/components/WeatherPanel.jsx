import { TriangleAlert } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { getWeather } from '@/services/weatherApi'
import CurrentWeather from '@/components/CurrentWeather'
import DailyForecast from '@/components/DailyForecast'
import HourlyForecast from '@/components/HourlyForecast'

const TemperatureChartModal = lazy(() => import('@/components/TemperatureChartModal'))

function WeatherPanel({ city, units, isFavorite, onToggleFavorite }) {
  const [isChartOpen, setIsChartOpen] = useState(false)
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    getWeather(city.latitude, city.longitude, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setWeather({ ...data, fetchedAt: new Date().toISOString() })
          setError('')
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsRefreshing(false)
      })

    return () => controller.abort()
  }, [city.latitude, city.longitude, attempt])

  function handleRetry() {
    if (isRefreshing) return
    setIsRefreshing(true)
    setError('')
    setAttempt((current) => current + 1)
  }

  if (error && !weather) {
    return (
      <div className="mt-8 rounded-2xl border border-red-300/20 bg-[#111e32] p-6">
        <div className="flex items-start gap-3">
          <TriangleAlert aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-red-300" />
          <div><p className="font-semibold text-white">Couldn’t load the weather</p><p role="alert" className="mt-1 text-sm text-red-200">{error}</p></div>
        </div>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 rounded-lg bg-sky-500 px-4 py-2 font-semibold text-slate-950 hover:bg-sky-400"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!weather) {
    return (
      <div role="status" aria-busy="true" className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
      </div>
    )
  }

  return (
    <div className="mt-10 grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      {isChartOpen && (
        <Suspense fallback={<p role="status" className="text-sm text-sky-300">Loading chart...</p>}>
        <TemperatureChartModal hours={weather.hourly} currentTime={weather.current.time} city={city} units={units} onClose={() => setIsChartOpen(false)} />
        </Suspense>
      )}
      <div className="min-w-0 space-y-8">
        <CurrentWeather city={city} weather={weather.current} units={units} onShowChart={() => setIsChartOpen(true)} onRefresh={handleRetry} isRefreshing={isRefreshing} fetchedAt={weather.fetchedAt} refreshError={error} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
        <DailyForecast days={weather.daily} units={units} />
      </div>
      <div className="min-w-0 xl:relative">
        <HourlyForecast hours={weather.hourly} currentTime={weather.current.time} timeZone={weather.timezone} units={units} />
      </div>
    </div>
  )
}

export default WeatherPanel
