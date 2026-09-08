import { Search } from 'lucide-react'

function SearchBar({ query, onQueryChange, onSearch, isLoading = false, disabled = false, onOpen, inputRef, voiceControl }) {

  function handleSubmit(event) {
    event.preventDefault()

    const city = query.trim()
    if (city.length < 2 || isLoading || disabled) return

    onSearch(city)
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex flex-col gap-3 sm:flex-row"
    >
      <div className="relative flex-1">
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />

        <input
          ref={inputRef}
          onFocus={onOpen}
          onClick={onOpen}
          type="search"
          autoComplete="off"
          aria-label="Search for a city"
          placeholder="Search for a city..."
          value={query}
          disabled={disabled}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-12 pr-14 text-white placeholder:text-slate-400 transition-colors enabled:hover:border-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:opacity-50"
        />
        {voiceControl}
      </div>

      <button
        type="submit"
        disabled={disabled || isLoading || query.trim().length < 2}
        
        className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default SearchBar
