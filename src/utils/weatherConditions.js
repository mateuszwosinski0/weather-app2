
const conditions = {
  0: ['Clear sky', 'icon-sunny.webp'],
  1: ['Mainly clear', 'icon-sunny.webp'],
  2: ['Partly cloudy', 'icon-partly-cloudy.webp'],
  3: ['Overcast', 'icon-overcast.webp'],
  45: ['Fog', 'icon-fog.webp'],
  48: ['Freezing fog', 'icon-fog.webp'],
  51: ['Light drizzle', 'icon-drizzle.webp'],
  53: ['Moderate drizzle', 'icon-drizzle.webp'],
  55: ['Dense drizzle', 'icon-drizzle.webp'],
  56: ['Light freezing drizzle', 'icon-drizzle.webp'],
  57: ['Dense freezing drizzle', 'icon-drizzle.webp'],
  61: ['Light rain', 'icon-rain.webp'],
  63: ['Moderate rain', 'icon-rain.webp'],
  65: ['Heavy rain', 'icon-rain.webp'],
  66: ['Light freezing rain', 'icon-rain.webp'],
  67: ['Heavy freezing rain', 'icon-rain.webp'],
  71: ['Light snow', 'icon-snow.webp'],
  73: ['Moderate snow', 'icon-snow.webp'],
  75: ['Heavy snow', 'icon-snow.webp'],
  77: ['Snow grains', 'icon-snow.webp'],
  80: ['Light rain showers', 'icon-rain.webp'],
  81: ['Moderate rain showers', 'icon-rain.webp'],
  82: ['Heavy rain showers', 'icon-rain.webp'],
  85: ['Light snow showers', 'icon-snow.webp'],
  86: ['Heavy snow showers', 'icon-snow.webp'],
  95: ['Thunderstorm', 'icon-storm.webp'],
  96: ['Thunderstorm with light hail', 'icon-storm.webp'],
  99: ['Thunderstorm with heavy hail', 'icon-storm.webp'],
}

export function getWeatherCondition(code, isDay) {
  const condition = Number.isInteger(code) ? conditions[code] : null
  if (!condition) return { description: 'Conditions unavailable', icon: null }

  const [description, dayIcon] = condition
  let icon = dayIcon

  if (isDay === 0) {
    if (code === 0 || code === 1) icon = 'half-moon.png'

    if (code === 2) icon = 'icon-overcast.webp'
  }

  return { description, icon: `/assets/images/${icon}` }
}
