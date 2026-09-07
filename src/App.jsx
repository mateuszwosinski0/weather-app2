import { useEffect, useState } from 'react'
import { loadLastCity, saveLastCity } from '@/utils/cityStorage'
import Header from '@/components/Header'
import CitySearch from '@/components/CitySearch'
import WeatherPanel from '@/components/WeatherPanel'
import {
  loadFavorites,
  saveFavorites,
} from '@/utils/FavoritesStorage'

function App() {
  const [selectedCity, setSelectedCity] = useState(loadLastCity)
  const [units, setUnits] = useState(() => {
    try {
      return localStorage.getItem('weatherapp.units') === 'imperial' ? 'imperial' : 'metric'
    } catch {
      return 'metric'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('weatherapp.units', units)
    } catch {
      // Storage may be unavailable; keep the app usable.
    }
  }, [units])

  useEffect(() => {
    saveLastCity(selectedCity)
  }, [selectedCity])


 const [favoriteCities, setFavoriteCities] = useState(loadFavorites)

useEffect(() => {
  saveFavorites(favoriteCities)
}, [favoriteCities])


function addFavorite(city) {
  if (!city || city.source === 'geolocation') return

  setFavoriteCities((current) => {
    const alreadySaved = current.some(
      (favorite) => favorite.id === city.id
    )

    if (alreadySaved) return current

    return [...current, city]
  })
}
const isFavorite = favoriteCities.some(
  (city) => city.id === selectedCity?.id
)

function removeFavorite(cityId) {
  setFavoriteCities((current) =>
    current.filter((city) => city.id !== cityId)
  )
}

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#102b46_0%,#080f20_55%)] text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Header units={units} onUnitsChange={setUnits} />
        <main className="py-8 sm:py-12">
          <h1 className="max-w-3xl font-heading text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            How’s the sky looking today?
          </h1>
          <p className="mt-4 text-slate-400">
            Search for a city to check the weather.
          </p>
          <CitySearch onCitySelect={setSelectedCity} favoriteCities={favoriteCities} onRemoveFavorite={removeFavorite} />
          {selectedCity && (
            <WeatherPanel key={selectedCity.id} city={selectedCity} units={units} isFavorite={isFavorite} onToggleFavorite={() => isFavorite ? removeFavorite(selectedCity.id) : addFavorite(selectedCity)} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
