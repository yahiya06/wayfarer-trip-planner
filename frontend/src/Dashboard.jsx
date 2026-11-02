import { useEffect, useState } from 'react'
import { createTrip, deleteTrip, getTrips, suggestTripRoute } from './api.js'
import './App.css'
import './Trip.css'
import CityAutocomplete from './CityAutocomplete.jsx'
import Avatar from './Avatar.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const initialTrip = {
  source: '',
  destination: '',
  startDate: '',
  endDate: '',
  travelers: '2',
}

function PlaneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 3-7.2 18-3.7-7.1L3 10.2 21 3Z" /><path d="m10.1 13.9 5-5" /></svg>
}

function Dashboard({ user, onNavigate, darkTheme, onToggleTheme }) {
  const [trip, setTrip] = useState(initialTrip)
  const [notice, setNotice] = useState('')
  const [trips, setTrips] = useState([])
  const [sourceCity, setSourceCity] = useState(null)
  const [destinationCity, setDestinationCity] = useState(null)
  const [tripToPlan, setTripToPlan] = useState(null)
  const [routeSuggestion, setRouteSuggestion] = useState('')
  const [routeDisclaimer, setRouteDisclaimer] = useState('')
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState('')

  useEffect(() => {
    getTrips().then(setTrips).catch(() => setTrips([]))
  }, [])

  function updateTrip(event) {
    setTrip((current) => ({ ...current, [event.target.name]: event.target.value }))
    setNotice('')
  }

  function swapTripCities() {
    setTrip((current) => ({ ...current, source: current.destination, destination: current.source }))
    setSourceCity(destinationCity)
    setDestinationCity(sourceCity)
    setNotice('')
  }

  function updateCity(field, value) {
    setTrip((current) => ({ ...current, [field]: value }))
    if (field === 'source') setSourceCity(null)
    if (field === 'destination') setDestinationCity(null)
    setNotice('')
  }

  function selectCity(field, city) {
    setTrip((current) => ({ ...current, [field]: city.label }))
    if (field === 'source') setSourceCity(city)
    if (field === 'destination') setDestinationCity(city)
    setNotice('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice('')
    if (!sourceCity || !destinationCity) {
      setNotice('Choose a city from the suggestions for both your starting point and destination.')
      return
    }
    if (sourceCity.label === destinationCity.label) {
      setNotice('Choose two different cities for your trip.')
      return
    }
    try {
      const savedTrip = await createTrip({ ...trip, travelers: Number(trip.travelers) })
      setTrips((currentTrips) => [savedTrip, ...currentTrips])
      setTripToPlan(savedTrip)
      setRouteSuggestion('')
      setRouteDisclaimer('')
      setRouteError('')
      setNotice('Your trip is saved. Ask the AI for a route idea below.')
      window.setTimeout(() => document.getElementById('route-assistant')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } catch (error) {
      setNotice(error.message)
    }
  }

  async function getRouteSuggestion(savedTrip) {
    setRouteLoading(true)
    setRouteError('')
    setRouteSuggestion('')
    setRouteDisclaimer('')
    try {
      const response = await suggestTripRoute(savedTrip.id)
      setRouteSuggestion(response.suggestion)
      setRouteDisclaimer(response.disclaimer)
    } catch (error) {
      setRouteError(error.message)
    } finally {
      setRouteLoading(false)
    }
  }

  async function handleDeleteTrip(tripId) {
    try {
      await deleteTrip(tripId)
      setTrips((currentTrips) => currentTrips.filter((savedTrip) => savedTrip.id !== tripId))
      if (tripToPlan?.id === tripId) setTripToPlan(null)
    } catch (error) {
      setNotice(error.message)
    }
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      .format(new Date(`${value}T12:00:00`))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
          <a className="brand" href="#home" aria-label="Wayfarer home" onClick={(event) => { event.preventDefault(); onNavigate('dashboard') }}>
          <span className="brand-mark"><PlaneIcon /></span>
          <span>wayfarer<span className="brand-period">.</span></span>
        </a>

        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-item active" href="#home" onClick={(event) => { event.preventDefault(); onNavigate('dashboard') }}><span className="nav-icon">⌂</span>Overview</a>
          <a className="nav-item" href="#plan-trip"><span className="nav-icon">＋</span>Plan a trip</a>
          <a className="nav-item" href="#saved-trips"><span className="nav-icon">▤</span>My trips<span className="nav-count">{trips.length}</span></a>
          <a className="nav-item" href="#assistant"><span className="nav-icon">✳</span>AI assistant</a>
          <button className="nav-item profile-nav" type="button" onClick={() => onNavigate('profile')}><span className="nav-icon">◉</span>My profile</button>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-sparkle">✳</span>
            <strong>Have a question?</strong>
            <p>Your travel assistant is here to help.</p>
            <a href="#assistant">Start a conversation <span>↗</span></a>
          </div>
          <button className="profile-button" type="button" aria-label="Open profile" onClick={() => onNavigate('profile')}>
            <Avatar name={user.name} email={user.email} size="small" variant={user.avatarStyle} />
            <span className="profile-text"><strong>{user.name || 'Traveler'}</strong><small>{user.email}</small></span>
            <span className="profile-menu">···</span>
          </button>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div>
          <div className="topbar-right"><span className="today-label">YOUR NEXT ADVENTURE STARTS HERE</span><ThemeToggle darkTheme={darkTheme} onToggle={onToggleTheme} /><button className="notification-button" type="button" aria-label="Notifications">♧<i /></button></div>
        </header>

        <section className="welcome-row">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR JOURNEY, YOUR WAY</div>
            <h1>Make room for <em>somewhere</em> new.</h1>
            <p className="welcome-copy">A little planning goes a long way. Where do you want to go?</p>
          </div>
          <div className="date-chip"><span className="sun-icon">☼</span><span>GOOD THINGS ARE AHEAD</span></div>
        </section>

        <section className="trip-planner" id="plan-trip" aria-labelledby="planner-heading">
          <div className="planner-heading-row">
            <div><div className="section-kicker">LET’S GET YOU THERE</div><h2 id="planner-heading">Plan your next trip</h2></div>
            <span className="step-indicator"><span>01</span> / 03</span>
          </div>

          <form className="trip-form" onSubmit={handleSubmit}>
            <div className="field location-field">
              <label className="field-label" htmlFor="trip-source">FROM</label>
              <CityAutocomplete id="trip-source" name="source" value={trip.source} selected={Boolean(sourceCity)} onChange={(value) => updateCity('source', value)} onSelect={(city) => selectCity('source', city)} placeholder="Your starting city" dotClass="origin-dot" />
            </div>
            <button className="swap-button" type="button" aria-label="Swap source and destination" onClick={swapTripCities}>↔</button>
            <div className="field location-field destination-field">
              <label className="field-label" htmlFor="trip-destination">GOING TO</label>
              <CityAutocomplete id="trip-destination" name="destination" value={trip.destination} selected={Boolean(destinationCity)} onChange={(value) => updateCity('destination', value)} onSelect={(city) => selectCity('destination', city)} placeholder="Where to?" dotClass="destination-dot" />
            </div>
            <label className="field date-field">
              <span className="field-label">DEPARTURE</span>
              <input name="startDate" type="date" value={trip.startDate} onChange={updateTrip} required />
            </label>
            <label className="field date-field">
              <span className="field-label">RETURN</span>
              <input name="endDate" type="date" value={trip.endDate} onChange={updateTrip} required />
            </label>
            <label className="field travelers-field">
              <span className="field-label">TRAVELERS</span>
              <select name="travelers" value={trip.travelers} onChange={updateTrip}>
                <option value="1">1 traveler</option><option value="2">2 travelers</option><option value="3">3 travelers</option><option value="4">4 travelers</option><option value="5">5 travelers</option><option value="6">6 travelers</option><option value="7">7 travelers</option><option value="8">8 travelers</option>
              </select>
            </label>
            <button className="plan-button" type="submit">Save this trip <span>↗</span></button>
          </form>
          {notice && <p className="form-notice" role="status">{notice}</p>}
          <div className="planner-footnote"><span>✳</span> Your plans, thoughtfully put together.</div>
        </section>

        {tripToPlan && (
          <section className="ai-route-planner" id="route-assistant" aria-labelledby="route-assistant-title">
            <div className="transport-planner-heading">
              <div><div className="section-kicker">YOUR TRIP IS SAVED</div><h2 id="route-assistant-title">Ask your AI travel assistant</h2><p>Get an AI-generated route concept for this saved trip.</p></div>
              <button className="transport-close" type="button" onClick={() => setTripToPlan(null)} aria-label="Close transport planner">×</button>
            </div>
            <div className="transport-route-summary">
              <div><span>FROM</span><strong>{tripToPlan.source}</strong></div><span className="transport-route-arrow" aria-hidden="true">→</span><div><span>TO</span><strong>{tripToPlan.destination}</strong></div>
              <div className="transport-trip-dates"><span>TRAVEL DATES</span><strong>{formatDate(tripToPlan.startDate)} – {formatDate(tripToPlan.endDate)}</strong></div>
              <div className="transport-trip-dates"><span>TRAVELERS</span><strong>{tripToPlan.travelers}</strong></div>
            </div>
                        <section className="ai-route-card" aria-labelledby="route-suggestion-heading">
              <div className="ai-route-card-heading"><div><span>AI ROUTE IDEAS</span><h3 id="route-suggestion-heading">Plan a possible way there</h3></div><button className="ai-route-button" type="button" onClick={() => getRouteSuggestion(tripToPlan)} disabled={routeLoading}>{routeLoading ? 'Asking Gemini…' : routeSuggestion ? 'Suggest another route' : 'Suggest a route'}</button></div>
              <p className="ai-route-intro">Gemini can suggest high-level route ideas, but it does not check live services, prices, or availability. When you request a suggestion, this trip’s cities, dates, and traveler count are sent to Google Gemini; free-tier prompts may be used to improve Google products.</p>
              {routeError && <p className="ai-route-error" role="alert">{routeError}</p>}
              {routeLoading && <p className="ai-route-loading" role="status">Preparing a route idea…</p>}
              {routeSuggestion && <div className="ai-route-answer"><p>{routeSuggestion}</p><small>{routeDisclaimer}</small></div>}
            </section>
          </section>
        )}

        <section className="ideas-section" aria-labelledby="ideas-heading">
          <div className="section-title-row"><div><div className="section-kicker">A PLACE TO START</div><h2 id="ideas-heading">A few ideas for your next escape</h2></div><a href="#destinations" className="text-link">Explore destinations <span>↗</span></a></div>
          <div className="destination-grid" id="destinations">
            <article className="destination-card goa-card">
              <div className="destination-photo goa-photo"><span className="photo-label">COASTAL GETAWAY</span><span className="photo-number">01</span></div>
              <div className="destination-info"><div><h3>Goa, India</h3><p>Golden shores &amp; slow mornings</p></div><span className="arrow-circle">↗</span></div>
            </article>
            <article className="destination-card jaipur-card">
              <div className="destination-photo jaipur-photo"><span className="photo-label">CULTURE &amp; COLOR</span><span className="photo-number">02</span></div>
              <div className="destination-info"><div><h3>Jaipur, India</h3><p>Palaces, bazaars &amp; pink walls</p></div><span className="arrow-circle">↗</span></div>
            </article>
            <article className="destination-card mountains-card">
              <div className="destination-photo mountains-photo"><span className="photo-label">MOUNTAIN AIR</span><span className="photo-number">03</span></div>
              <div className="destination-info"><div><h3>Manali, India</h3><p>Fresh air &amp; winding roads</p></div><span className="arrow-circle">↗</span></div>
            </article>
          </div>
          <p className="ideas-caption">Destination inspiration only · Details and availability will be verified when you plan your trip.</p>
        </section>

        <section className="saved-trips-section" id="saved-trips" aria-labelledby="saved-trips-heading">
          <div className="section-title-row"><div><div className="section-kicker">YOUR PERSONAL TRAVEL LIST</div><h2 id="saved-trips-heading">My trips</h2></div><span className="trip-total">{trips.length} saved</span></div>
          {trips.length === 0 ? <div className="empty-trips"><span>✳</span><p>No trips saved yet. Start with a destination above and your trip outline will appear here.</p></div> : (
            <div className="saved-trip-list">{trips.map((savedTrip) => <article className="saved-trip-card" key={savedTrip.id}><div className="saved-trip-route"><span className="saved-route-source">{savedTrip.source}</span><span className="saved-route-line">→</span><strong>{savedTrip.destination}</strong></div><div className="saved-trip-meta"><span>{formatDate(savedTrip.startDate)} – {formatDate(savedTrip.endDate)}</span><span>{savedTrip.travelers} {savedTrip.travelers === 1 ? 'traveler' : 'travelers'}</span></div><span className="saved-trip-label">TRIP OUTLINE</span><button className="plan-saved-trip-button" type="button" onClick={() => { setTripToPlan(savedTrip); setRouteSuggestion(""); setRouteDisclaimer(""); setRouteError(""); window.setTimeout(() => document.getElementById("route-assistant")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50) }}>Ask AI for a route</button><button className="remove-trip-button" type="button" onClick={() => handleDeleteTrip(savedTrip.id)} aria-label={`Remove trip to ${savedTrip.destination}`}>×</button></article>)}</div>
          )}
        </section>

        <section className="assistant-banner" id="assistant">
          <div className="assistant-icon">✳</div>
          <div className="assistant-copy"><span>AI TRIP PLANNING</span><h2>Need a route idea?</h2><p>Save a trip, then ask Gemini for a route concept. Check real schedules and prices with providers.</p></div>
          <a className="assistant-link" href="#plan-trip">Plan a trip <span>↗</span></a>
        </section>

        <footer className="footer"><span>© 2026 Wayfarer</span><span>Made for the places that stay with you <b>✳</b></span></footer>
      </main>
    </div>
  )
}

export default Dashboard
