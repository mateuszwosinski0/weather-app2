const CITY_STORAGE_KEY = 'weatherapp.lastCity'

function normalizeCity(city) {
  if (
    !city || typeof city !== 'object' || city.source === 'geolocation' ||
    !Number.isInteger(city.id) ||
    typeof city.name !== 'string' || !city.name.trim() ||
    !Number.isFinite(city.latitude) || Math.abs(city.latitude) > 90 ||
    !Number.isFinite(city.longitude) || Math.abs(city.longitude) > 180
  ) return null

  return {
    id: city.id,
    name: city.name.trim(),
    latitude: city.latitude,
    longitude: city.longitude,
    country: typeof city.country === 'string' ? city.country : '',
    admin1: typeof city.admin1 === 'string' ? city.admin1 : '',
  }
}

export function loadLastCity() {
  try {
    return normalizeCity(JSON.parse(localStorage.getItem(CITY_STORAGE_KEY)))
  } catch {
    return null
  }
}

export function saveLastCity(city) {
  const value = normalizeCity(city)
  if (!value) return
  try {
    localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Storage can be unavailable in private browsing or when quota is exceeded.
  }
}
