import { useEffect, useState } from 'react'
import { createTrip, deleteTrip, getTrips } from './api.js'
import './App.css'
import './Trip.css'
import Avatar from './Avatar.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const initialTrip = {
  source: 'Indore',
  destination: 'Goa',
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

  useEffect(() => {
    getTrips().then(setTrips).catch(() => setTrips([]))
  }, [])

  function updateTrip(event) {
    setTrip({ ...trip, [event.target.name]: event.target.value })
    setNotice('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice('')
    try {
      const savedTrip = await createTrip({ ...trip, travelers: Number(trip.travelers) })
      setTrips((currentTrips) => [savedTrip, ...currentTrips])
      setNotice('Trip saved to My trips. This is a saved trip outline; transport and hotel options have not been searched.')
    } catch (error) {
      setNotice(error.message)
    }
  }

  async function handleDeleteTrip(tripId) {
    try {
      await deleteTrip(tripId)
      setTrips((currentTrips) => currentTrips.filter((savedTrip) => savedTrip.id !== tripId))
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
            <label className="field location-field">
              <span className="field-label">FROM</span>
              <span className="input-wrap"><span className="location-dot origin-dot" /><input name="source" value={trip.source} onChange={updateTrip} placeholder="Your starting city" required /></span>
            </label>
            <button className="swap-button" type="button" aria-label="Swap source and destination" onClick={() => setTrip({ ...trip, source: trip.destination, destination: trip.source })}>↔</button>
            <label className="field location-field destination-field">
              <span className="field-label">GOING TO</span>
              <span className="input-wrap"><span className="location-dot destination-dot" /><input name="destination" value={trip.destination} onChange={updateTrip} placeholder="Where to?" required /></span>
            </label>
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
            <div className="saved-trip-list">{trips.map((savedTrip) => <article className="saved-trip-card" key={savedTrip.id}><div className="saved-trip-route"><span className="saved-route-source">{savedTrip.source}</span><span className="saved-route-line">→</span><strong>{savedTrip.destination}</strong></div><div className="saved-trip-meta"><span>{formatDate(savedTrip.startDate)} – {formatDate(savedTrip.endDate)}</span><span>{savedTrip.travelers} {savedTrip.travelers === 1 ? 'traveler' : 'travelers'}</span></div><span className="saved-trip-label">TRIP OUTLINE</span><button className="remove-trip-button" type="button" onClick={() => handleDeleteTrip(savedTrip.id)} aria-label={`Remove trip to ${savedTrip.destination}`}>×</button></article>)}</div>
          )}
        </section>

        <section className="assistant-banner" id="assistant">
          <div className="assistant-icon">✳</div>
          <div className="assistant-copy"><span>YOUR TRAVEL SIDEKICK</span><h2>Curious about Goa?</h2><p>Ask about beaches, local favorites, or what to pack. Your assistant can help you explore.</p></div>
          <a className="assistant-link" href="mailto:hello@wayfarer.example?subject=Travel%20assistant">Meet your assistant <span>↗</span></a>
        </section>

        <footer className="footer"><span>© 2026 Wayfarer</span><span>Made for the places that stay with you <b>✳</b></span></footer>
      </main>
    </div>
  )
}

export default Dashboard
