const STORAGE_KEY = 'weatherapp.favorites'

export function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))

    if (!Array.isArray(saved)) return []

    return saved.filter((city) =>
      city &&
      city.source !== 'geolocation' &&
      Number.isInteger(city.id) &&
      typeof city.name === 'string' &&
      city.name.trim() &&
      Number.isFinite(city.latitude) &&
      Math.abs(city.latitude) <= 90 &&
      Number.isFinite(city.longitude) &&
      Math.abs(city.longitude) <= 180
    )
  } catch {
    return []
  }
}

export function saveFavorites(cities) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities))
  } catch {
    // Storage can be unavailable in private browsing or when quota is exceeded.
  }
}
