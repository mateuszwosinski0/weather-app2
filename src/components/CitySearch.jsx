import { TriangleAlert, Star } from 'lucide-react'
import { useId, useRef } from 'react'
import LocationButton from '@/components/LocationButton'
import VoiceSearchButton from '@/components/VoiceSearchButton'
import SearchBar from '@/components/SearchBar'
import useCitySearch from '@/hooks/useCitySearch'
import useClickOutside from '@/hooks/useClickOutside'
import useListNavigation from '@/hooks/useListNavigation'

function CitySearch({ onCitySelect, favoriteCities, onRemoveFavorite }) {
  const {
    query, isOpen, activeTab, isLocating, isListening, cities, isLoading, error, hasSearched,
    setIsLocating, setIsListening, closeResults, handleSearch, handleQueryChange,
    openPanel, changeTab, selectCity, handleVoiceResult, handleVoiceError,
  } = useCitySearch({ onCitySelect, favoriteCities })
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const tabRefs = useRef({})
  const id = useId()

  useClickOutside(rootRef, closeResults, isOpen)

  const visibleCities = activeTab === 'favorites' ? favoriteCities : cities
  const { handleKeyDown: navigateList } = useListNavigation({
    count: isOpen && !isLocating && !isListening && (activeTab === 'favorites' || (!isLoading && !error)) ? visibleCities.length : 0,
    loop: true,
    isOpen,
    onOpen: openPanel,
    openOnSelect: false,
    onSelect: (index) => handleSelect(visibleCities[index]),
    onNavigate: (index) => {
      const option = rootRef.current.querySelectorAll('[data-city-option]:enabled')[index]
      option?.focus({ preventScroll: true })
      option?.scrollIntoView({ block: 'nearest' })
    },
  })

  function handleNavigation(event) {
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Escape') {
      event.preventDefault()
      inputRef.current?.focus()
      closeResults()
      return
    }
    if (event.target !== inputRef.current && !event.target.matches('[data-city-option]')) return
    const options = [...rootRef.current.querySelectorAll('[data-city-option]:enabled')]
    navigateList(event, {
      currentIndex: options.indexOf(document.activeElement),
      allowHomeEnd: event.target !== inputRef.current,
    })
  }

  function handleSelect(city) {
    inputRef.current?.focus()
    selectCity(city)
  }

  return (
    <section ref={rootRef} aria-label="City search"
      onKeyDown={handleNavigation}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeResults() }}
    >
      <div className="mt-8 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <SearchBar query={query} onQueryChange={handleQueryChange} onSearch={handleSearch} isLoading={isLoading} disabled={isLocating || isListening} onOpen={openPanel} inputRef={inputRef}
            voiceControl={<VoiceSearchButton disabled={isLocating || isLoading} onBusyChange={(busy) => { if (busy) closeResults(); setIsListening(busy) }} onResult={handleVoiceResult} onError={handleVoiceError} />}
          />
        </div>
        <LocationButton onCitySelect={handleSelect} onBusyChange={(busy) => { if (busy) closeResults(); setIsLocating(busy) }} disabled={isLoading || isListening} />
      </div>
      {isListening && <p role="status" className="mt-2 text-sm text-sky-300">Listening… Say a city name.</p>}
      {isOpen && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-sky-300/15 bg-[#111e32] shadow-xl shadow-black/10">
          <div role="tablist" aria-label="Choose city source" className="flex gap-2 border-b border-white/10 p-2">
            {['results', 'favorites'].map((tab) => (
              <button key={tab} ref={(element) => { tabRefs.current[tab] = element }} id={id + '-' + tab} role="tab" type="button" aria-selected={activeTab === tab} aria-controls={id + '-panel-' + tab} tabIndex={activeTab === tab ? 0 : -1}
                onClick={() => changeTab(tab)}
                onKeyDown={(event) => {
                  if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                    event.preventDefault()
                    const next = event.key === 'Home' ? 'results' : event.key === 'End' ? 'favorites' : tab === 'results' ? 'favorites' : 'results'
                    changeTab(next)
                    tabRefs.current[next]?.focus()
                  }
                }}
                className={'rounded-xl px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-sky-400 ' + (activeTab === tab ? 'bg-sky-400/15 text-sky-300' : 'text-slate-400 hover:bg-white/5 hover:text-white')}
              >{tab === 'results' ? 'Results' : 'Favorites · ' + favoriteCities.length}</button>
            ))}
          </div>
          <div role="tabpanel" id={id + '-panel-' + activeTab} aria-labelledby={id + '-' + activeTab}>
            {activeTab === 'favorites' ? (
              <p role="status" className="px-4 py-4 text-sm text-slate-400">{favoriteCities.length ? 'Choose a saved city.' : 'No favorites yet. Use the star next to a city name to save it.'}</p>
            ) : isLoading ? (
              <div role="status" aria-label="Searching for cities" className="space-y-2 p-3" aria-busy="true">
                {[1, 2, 3].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-white/5" />)}
              </div>
            ) : error ? (
              <div role="alert" className="m-3 flex items-start gap-3 rounded-xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-200">
                <TriangleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                <div><p>{error}</p><button type="button" onClick={() => handleSearch(query)} className="mt-2 font-semibold text-red-100 underline underline-offset-2 hover:text-white">Try again</button></div>
              </div>
            ) : query.trim().length < 2 ? (
              <p role="status" className="px-4 py-4 text-sm text-slate-400">Type at least 2 characters to search.</p>
            ) : hasSearched && !cities.length ? (
              <div role="status" className="px-4 py-6 text-center"><p className="font-semibold text-white">No cities found</p><p className="mt-1 text-sm text-slate-400">Try a different spelling or a nearby city.</p></div>
            ) : null}
            <ul aria-label={activeTab === 'favorites' ? 'Favorite cities' : 'City suggestions'} className="max-h-80 overflow-y-auto p-2 [scrollbar-color:#334155_transparent]">
              {(activeTab === 'favorites' || (!isLoading && !error)) && visibleCities.map((city) => (
                <li key={city.id} className="flex items-center rounded-xl hover:bg-sky-300/5">
                  <button data-city-option type="button" onClick={() => handleSelect(city)} disabled={isLocating || isListening} className="min-w-0 flex-1 rounded-xl px-3 py-3 text-left focus-visible:bg-sky-400/15 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-400">
                    <span className="block font-semibold text-white">{city.name}</span>
                    <span className="text-sm text-slate-400">{[city.admin1, city.country].filter(Boolean).join(', ')}</span>
                  </button>
                  {activeTab === 'favorites' && (
                    <button type="button" title="Remove from favorites" aria-label={'Remove ' + city.name + ' from favorites'} onClick={() => { tabRefs.current.favorites?.focus(); onRemoveFavorite(city.id) }} className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sky-300 hover:bg-sky-300/10 focus-visible:outline-2 focus-visible:outline-sky-400">
                      <Star aria-hidden="true" className="h-5 w-5" fill="currentColor" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}

export default CitySearch
