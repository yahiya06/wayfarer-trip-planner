import { useEffect, useState } from 'react'
import { searchCities } from './api.js'

function CityAutocomplete({ id, name, value, selected, placeholder, dotClass, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const query = value.trim()
    if (selected || query.length < 3) {
      setSuggestions([])
      setOpen(false)
      setLoading(false)
      setError('')
      return undefined
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => {
      setLoading(true)
      setError('')
      searchCities(query, controller.signal)
        .then((results) => {
          setSuggestions(results)
          setOpen(true)
        })
        .catch((requestError) => {
          if (requestError.name !== 'AbortError') {
            setSuggestions([])
            setError('City suggestions could not load. Try again in a moment.')
            setOpen(true)
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, 250)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [value, selected])

  function choose(city) {
    onSelect(city)
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div className="city-autocomplete">
      <span className="input-wrap">
        <span className={`location-dot ${dotClass}`} />
        <input
          id={id}
          name={name}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={`${id}-suggestions`}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          required
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => { if (suggestions.length > 0 || error) setOpen(true) }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpen(false)
            if (event.key === 'Enter' && open && suggestions.length > 0) {
              event.preventDefault()
              choose(suggestions[0])
            }
          }}
        />
      </span>
      {value.trim().length > 0 && value.trim().length < 3 && !selected && (
        <span className="city-search-hint">Type 3 or more letters to search.</span>
      )}
      {open && (suggestions.length > 0 || loading || error) && (
        <div className="city-suggestion-list" id={`${id}-suggestions`} role="listbox" aria-label={`${name} city suggestions`}>
          {loading && <div className="city-suggestion-status">Searching cities…</div>}
          {error && <div className="city-suggestion-status" role="status">{error}</div>}
          {!loading && !error && suggestions.map((city, index) => (
            <button
              className="city-suggestion"
              type="button"
              role="option"
              aria-selected="false"
              key={`${city.label}-${index}`}
              onClick={() => choose(city)}
            >
              <span className="city-suggestion-pin" aria-hidden="true">⌖</span>
              <span><strong>{city.name}</strong><small>{[city.region, city.country].filter(Boolean).join(', ')}</small></span>
            </button>
          ))}
          {!loading && !error && suggestions.length === 0 && (
            <div className="city-suggestion-status">No matching cities found.</div>
          )}
          <div className="city-suggestion-attribution">City names: Open-Meteo · GeoNames</div>
        </div>
      )}
    </div>
  )
}

export default CityAutocomplete
