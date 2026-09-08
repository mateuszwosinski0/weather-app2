import { useEffect, useRef, useState } from 'react'
import { searchCities } from '@/services/weatherApi'

export default function useCitySearch({ onCitySelect, favoriteCities }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('results')
  const [isLocating, setIsLocating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const timer = useRef(null)
  const request = useRef(null)

  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
      request.current?.abort()
    }
  }, [])

  function cancelSearch() {
    clearTimeout(timer.current)
    request.current?.abort()
  }

  function closeResults() {
    cancelSearch()
    setIsOpen(false)
    setIsLoading(false)
  }

  async function handleSearch(value) {
    cancelSearch()
    const search = value.trim()
    if (search.length < 2 || isLocating) return
    const controller = new AbortController()
    request.current = controller
    setIsOpen(true)
    setActiveTab('results')
    setIsLoading(true)
    setError('')
    setCities([])
    setHasSearched(false)
    try {
      const results = await searchCities(search, controller.signal)
      if (!controller.signal.aborted) { setCities(results); setHasSearched(true) }
    } catch (error) {
      if (!controller.signal.aborted) setError(error.message)
    } finally {
      if (!controller.signal.aborted) setIsLoading(false)
    }
  }

  function handleQueryChange(value) {
    cancelSearch()
    setQuery(value)
    setCities([])
    setHasSearched(false)
    setError('')
    setIsLoading(false)
    setIsOpen(true)
    setActiveTab(value.trim() ? 'results' : favoriteCities.length ? 'favorites' : 'results')
    if (value.trim().length >= 2) timer.current = setTimeout(() => handleSearch(value), 350)
  }

  function openPanel() {
    if (isLocating || isListening || isOpen) return
    setIsOpen(true)
    setActiveTab(!query.trim() && favoriteCities.length ? 'favorites' : 'results')
    if (query.trim().length >= 2 && !hasSearched) handleSearch(query)
  }

  function changeTab(tab) {
    cancelSearch()
    setIsLoading(false)
    setActiveTab(tab)
    if (tab === 'results' && query.trim().length >= 2 && !hasSearched) handleSearch(query)
  }

  function handleSelect(city) {
    closeResults()
    setQuery(city.source === 'geolocation' ? '' : city.name)
    setCities([])
    setHasSearched(false)
    setError('')
    onCitySelect(city)
  }

  function handleVoiceResult(text) {
    setQuery(text)
    handleSearch(text)
  }

  function handleVoiceError(message) {
    cancelSearch()
    setIsLoading(false)
    setError(message)
    setActiveTab('results')
    setIsOpen(true)
  }

  return {
    query, isOpen, activeTab, isLocating, isListening, cities, isLoading, error, hasSearched,
    setIsLocating, setIsListening, closeResults, handleSearch, handleQueryChange,
    openPanel, changeTab, selectCity: handleSelect, handleVoiceResult, handleVoiceError,
  }
}
