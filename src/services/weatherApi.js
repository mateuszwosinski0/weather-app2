export async function searchCities(query, signal) {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error('Could not search for cities. Please try again.')
  }

  const data = await response.json()

  return data.results ?? []
}
export async function getWeather(latitude, longitude, signal) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,is_day',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
    timezone: 'auto',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    forecast_days: '7',
    hourly: 'temperature_2m,weather_code,precipitation_probability,is_day',
  })

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    { signal, cache: 'no-cache' }
  )

  if (!response.ok) {
    throw new Error('Could not load the weather. Please try again.')
  }

  const data = await response.json()
  if (!data.current || !Number.isFinite(data.current.temperature_2m)) {
    throw new Error('Weather data is unavailable for this location.')
  }

  const daily = Array.isArray(data.daily?.time)
    ? data.daily.time.slice(0, 7).map((date, index) => ({
        date,
        code: data.daily.weather_code?.[index],
        max: data.daily.temperature_2m_max?.[index],
        min: data.daily.temperature_2m_min?.[index],
      }))
    : []

  const hourly = Array.isArray(data.hourly?.time)
    ? data.hourly.time.map((time, index) => ({
        time,
        temperature: data.hourly.temperature_2m?.[index],
        code: data.hourly.weather_code?.[index],
        precipitationProbability: data.hourly.precipitation_probability?.[index],
        isDay: data.hourly.is_day?.[index],
      }))
    : []

  return { current: data.current, daily, hourly, timezone: data.timezone }
}
