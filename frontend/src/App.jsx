import { useEffect, useRef, useState } from 'react'
import Dashboard from './Dashboard.jsx'
import { changePassword, deleteAccount, getCurrentUser, getTrips, loginAccount, logoutAccount, registerAccount, resendVerification, updateProfile, verifyEmail } from './api.js'
import './AccountSecurity.css'
import './App.css'
import './DarkTheme.css'
import Avatar, { avatarStyles } from './Avatar.jsx'
import ThemeToggle from './ThemeToggle.jsx'

function getPasswordRequirements(password) {
  const repeatedCharacter = /(.)\1{3,}/u.test(password)
  const weakPattern = /password|qwerty|123456|abcdefgh|letmein|admin123/i.test(password)
  return [
    { label: 'At least 8 characters', valid: [...password].length >= 8 && new TextEncoder().encode(password).length <= 72 },
    { label: 'An uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'A lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'A number', valid: /\d/.test(password) },
    { label: 'A symbol', valid: /[^A-Za-z\d\s]/.test(password) },
    { label: 'No four repeated characters', valid: !repeatedCharacter },
    { label: 'Avoid common password patterns', valid: !weakPattern },
  ]
}

function isStrongPassword(password) {
  return getPasswordRequirements(password).every((requirement) => requirement.valid)
}

const pagePaths = {
  landing: '/',
  signup: '/signup',
  login: '/login',
  verifyEmail: '/verify-email',
  dashboard: '/dashboard',
  profile: '/profile',
}

function pageFromPath(pathname) {
  return Object.entries(pagePaths).find(([, path]) => path === pathname)?.[0] || 'landing'
}

function Brand({ onClick }) {
  return <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); onClick() }}><span className="brand-mark">↗</span><span>wayfarer<span className="brand-period">.</span></span></a>
}

function LandingPage({ onNavigate, darkTheme, onToggleTheme }) {
  return (
    <div className="public-page">
      <header className="public-header"><Brand onClick={() => onNavigate('landing')} /><nav><a href="#how-it-works">How it works</a><a href="#inspiration">Explore</a></nav><div className="public-actions"><ThemeToggle darkTheme={darkTheme} onToggle={onToggleTheme} /><button className="sign-in-link" onClick={() => onNavigate('login')}>Log in</button><button className="public-primary" onClick={() => onNavigate('signup')}>Create account <span>↗</span></button></div></header>
      <main>
        <section className="landing-hero">
          <div className="landing-copy"><div className="landing-eyebrow"><span /> TRAVEL, THOUGHTFULLY PLANNED</div><h1>Go beyond the <em>usual.</em><br />Find your somewhere.</h1><p>From the first idea to the last day of your trip, bring every detail together in one place—with a little help from your personal travel assistant.</p><div className="landing-ctas"><button className="landing-primary" onClick={() => onNavigate('signup')}>Plan your first trip <span>↗</span></button><button className="landing-secondary" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>See how it works <span>↓</span></button></div><div className="landing-trust"><span className="trust-avatars"><i>A</i><i>M</i><i>R</i></span><span>Made for curious travelers</span></div></div>
          <div className="landing-art" aria-label="Illustration of a coastal destination"><div className="art-sun"/><div className="art-hill hill-back"/><div className="art-hill hill-front"/><div className="art-water"/><div className="art-palm palm-one"><i/><b/><b/><b/><b/></div><div className="art-palm palm-two"><i/><b/><b/><b/><b/></div><div className="art-postcard"><span>YOUR NEXT CHAPTER</span><strong>Somewhere<br />by the sea.</strong><small>GOA · INDIA</small></div><div className="art-caption"><span>01</span> A SLOW MORNING IN GOA</div></div>
        </section>
        <div className="landing-strip"><span>LESS SCROLLING, MORE EXPLORING</span><i>✳</i><span>YOUR TRIP, ALL IN ONE PLACE</span><i>✳</i><span>GOOD QUESTIONS, BETTER ANSWERS</span></div>
        <section className="how-section" id="how-it-works"><div className="how-intro"><div className="section-kicker">A BETTER WAY TO GET AWAY</div><h2>From “what if?”<br />to <em>“let’s go.”</em></h2><p>Travel planning should feel like part of the adventure. Start with a place, and build a trip that feels like yours.</p><button className="simple-link" onClick={() => onNavigate('signup')}>Start planning <span>↗</span></button></div><div className="how-steps"><article><span>01</span><div><h3>Tell us where you’re dreaming of</h3><p>Choose your starting point, destination, dates, and who’s coming along.</p></div></article><article><span>02</span><div><h3>Shape a trip that feels like you</h3><p>Bring travel details, places to explore, and ideas into one itinerary.</p></div></article><article><span>03</span><div><h3>Keep every detail close</h3><p>Save your plans to your profile and revisit them whenever you need.</p></div></article></div></section>
        <section className="landing-inspiration" id="inspiration"><div><div className="section-kicker">A LITTLE INSPIRATION</div><h2>Maybe it’s time for Goa.</h2><p>Salt air, old neighborhoods, and afternoons with nowhere to be.</p></div><button className="inspiration-cta" onClick={() => onNavigate('signup')}>Make it your next trip <span>↗</span></button></section>
      </main>
      <footer className="public-footer"><Brand onClick={() => onNavigate('landing')} /><span>© 2026 Wayfarer · Thoughtful travel starts here.</span><button onClick={() => onNavigate('login')}>Already have an account? <b>Log in</b></button></footer>
    </div>
  )
}

function AuthPage({ mode, onNavigate, onAccountCreated, onLogin, darkTheme, onToggleTheme }) {
  const isSignup = mode === 'signup'
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  async function submit(event) {
    event.preventDefault()
    setError('')
    const data = new FormData(event.currentTarget)
    if (!isSignup) {
      try {
        await onLogin({ email: data.get('email'), password: data.get('password') })
      } catch (requestError) {
        setError(requestError.message)
      }
      return
    }
    const password = data.get('password')
    if (!isStrongPassword(password)) {
      setError('Please meet each password requirement before creating your account.')
      return
    }
    if (password !== data.get('confirmPassword')) {
      setError('Those passwords do not match. Please check and try again.')
      return
    }
    try {
      const notice = await registerAccount({ name: data.get('name').trim(), email: data.get('email').trim(), password })
      onAccountCreated(notice)
    } catch (requestError) {
      setError(requestError.message)
    }
  }
  return (
    <div className="auth-page"><header className="public-header"><Brand onClick={() => onNavigate('landing')} /><div className="auth-header-actions"><ThemeToggle darkTheme={darkTheme} onToggle={onToggleTheme} /><button className="auth-back" onClick={() => onNavigate('landing')}>← Back to home</button></div></header><main className="auth-layout"><aside className="auth-visual"><div className="auth-visual-mark">✳</div><span>MADE FOR THE WAY YOU WANT TO TRAVEL</span><h1>Every good trip<br />starts <em>somewhere.</em></h1><p>Keep your ideas, plans, and places together as your next adventure takes shape.</p><div className="auth-visual-note">A little more wonder, a little less planning stress.</div></aside><section className="auth-card"><div className="section-kicker">{isSignup ? 'YOUR NEXT CHAPTER' : 'WELCOME BACK'}</div><h2>{isSignup ? 'Create your account' : 'Good to see you again'}</h2><p className="auth-subtitle">{isSignup ? 'Start collecting places you can’t wait to see.' : 'Sign in to pick up where your plans left off.'}</p><form onSubmit={submit} className="auth-form">{isSignup && <label>Full name<input name="name" type="text" placeholder="e.g. Aanya Sharma" autoComplete="name" required /></label>}<label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label><label>Password<input name="password" type="password" placeholder={isSignup ? 'Choose a strong password' : 'Your password'} autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={isSignup ? '8' : '1'} value={isSignup ? password : undefined} onChange={isSignup ? (event) => setPassword(event.target.value) : undefined} required />{isSignup && <small className="password-hint">At least 8 characters with mixed character types. Avoid easy patterns like 11111111.</small>}</label>{isSignup && <><ul className="password-checklist" aria-live="polite">{getPasswordRequirements(password).map((requirement) => <li className={requirement.valid ? 'valid' : ''} key={requirement.label}><span>{requirement.valid ? '✓' : '○'}</span>{requirement.label}</li>)}</ul><label>Confirm password<input name="confirmPassword" type="password" placeholder="Type your password again" autoComplete="new-password" minLength="8" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /><small className="password-hint">{confirmPassword && password !== confirmPassword ? 'Passwords do not match yet.' : 'Re-enter the same password.'}</small></label></>}{error && <p className="auth-message" role="status">{error}</p>}<button className="auth-submit" type="submit">{isSignup ? 'Create my account' : 'Log in'} <span>↗</span></button></form><p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to Wayfarer?'} <button onClick={() => onNavigate(isSignup ? 'login' : 'signup')}>{isSignup ? 'Log in' : 'Create an account'}</button></p><p className="auth-demo-note">Your password is securely hashed by the server and is never returned to the browser.</p></section></main></div>
  )
}

function EmailVerificationPage({ initialEmail, onNavigate, darkTheme, onToggleTheme }) {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const verificationStarted = useRef(false)
  const [email, setEmail] = useState(initialEmail || params.get('email') || '')
  const [status, setStatus] = useState(token ? 'verifying' : 'waiting')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || verificationStarted.current) return
    verificationStarted.current = true
    verifyEmail(token).then((result) => {
      setStatus('verified')
      setMessage(result.message)
    }).catch((requestError) => {
      setStatus('error')
      setError(requestError.message)
    })
  }, [token])

  async function resend(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      const result = await resendVerification(email)
      setMessage(result.message)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="auth-page"><header className="public-header"><Brand onClick={() => onNavigate('landing')} /><div className="auth-header-actions"><ThemeToggle darkTheme={darkTheme} onToggle={onToggleTheme} /><button className="auth-back" onClick={() => onNavigate('landing')}>← Back to home</button></div></header>
      <main className="verification-content"><section className="auth-card verification-card">
        <div className="verification-mark">{status === 'verified' ? '✓' : '✉'}</div>
        <div className="section-kicker">ACCOUNT VERIFICATION</div>
        <h2>{status === 'verified' ? 'Email verified' : status === 'verifying' ? 'Verifying your email…' : 'Check your email'}</h2>
        <p className="auth-subtitle">{status === 'verified' ? (message || 'Your account is ready. Log in to continue.') : 'Verify your email address before logging in. Verification links expire after 24 hours.'}</p>
        {status === 'verified' ? <button className="auth-submit verification-login" type="button" onClick={() => onNavigate('login')}>Continue to login <span>↗</span></button> : <>
          {status === 'error' && <p className="auth-message" role="alert">{error}</p>}
          {message && <p className="saved-message" role="status">{message}</p>}
          <form className="auth-form" onSubmit={resend}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><button className="auth-submit" type="submit">Resend verification link</button></form>
          <p className="auth-demo-note">For local development, the verification link is printed in the Spring Boot console. Real email delivery requires SMTP settings.</p>
        </>}
      </section></main>
    </div>
  )
}

function AccountSecurity({ onAccountDeleted }) {
  const [activeAction, setActiveAction] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const passwordRequirements = getPasswordRequirements(newPassword)

  function closeAction() {
    setActiveAction('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
    setDeletePassword('')
    setDeleteConfirmation('')
    setPasswordError('')
    setDeleteError('')
    setPasswordMessage('')
  }

  async function submitPassword(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')
    if (!isStrongPassword(newPassword)) {
      setPasswordError('Please meet every new password requirement.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('The new passwords do not match.')
      return
    }
    try {
      await changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setPasswordMessage('Password changed successfully.')
      setTimeout(closeAction, 900)
    } catch (requestError) {
      setPasswordError(requestError.message)
    }
  }

  async function submitDelete(event) {
    event.preventDefault()
    setDeleteError('')
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError('Type DELETE exactly to confirm account removal.')
      return
    }
    try {
      await deleteAccount({ currentPassword: deletePassword })
      onAccountDeleted()
    } catch (requestError) {
      setDeleteError(requestError.message)
    }
  }

  return (
    <section className="security-card">
      <div className="account-settings-heading"><div><div className="section-kicker">ACCOUNT SETTINGS</div><h2>Login and security</h2><p>Password and account actions are tucked away until you need them.</p></div></div>
      <div className="account-action-buttons">
        <button className="account-action-button" type="button" onClick={() => setActiveAction('password')}><span><strong>Change password</strong><small>Update your sign-in password</small></span><b>›</b></button>
        <button className="account-action-button delete-action-link" type="button" onClick={() => setActiveAction('delete')}><span><strong>Delete account</strong><small>Permanently remove your account and profile</small></span><b>›</b></button>
      </div>
      <p className="email-auth-note">Email changes and password recovery are planned for a later update.</p>

      {activeAction && <div className="settings-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAction() }}>
        <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
          <button className="settings-modal-close" type="button" onClick={closeAction} aria-label="Close dialog">×</button>
          {activeAction === 'password' ? <>
            <div className="section-kicker">ACCOUNT SECURITY</div><h2 id="settings-modal-title">Change password</h2><p className="modal-description">Confirm your current password, then choose a new strong password.</p>
            <form className="security-form modal-form" onSubmit={submitPassword}>
              <label>Current password<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required /></label>
              <label>New password<input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength="8" required /></label>
              <ul className="password-checklist security-checklist" aria-live="polite">{passwordRequirements.map((requirement) => <li className={requirement.valid ? 'valid' : ''} key={requirement.label}><span>{requirement.valid ? '✓' : '○'}</span>{requirement.label}</li>)}</ul>
              <label>Confirm new password<input type="password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} autoComplete="new-password" minLength="8" required /></label>
              {passwordError && <p className="auth-message" role="alert">{passwordError}</p>}{passwordMessage && <p className="saved-message" role="status">{passwordMessage}</p>}
              <div className="modal-actions"><button className="auth-submit" type="submit">Save new password</button><button className="cancel-edit-button" type="button" onClick={closeAction}>Cancel</button></div>
            </form>
          </> : <>
            <div className="section-kicker">PERMANENT ACTION</div><h2 id="settings-modal-title">Delete your account?</h2><p className="modal-description">This permanently removes your profile and saved trips. You’ll need to enter your password and type DELETE to confirm.</p>
            <form className="security-form modal-form" onSubmit={submitDelete}>
              <label>Current password<input type="password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} autoComplete="current-password" required /></label>
              <label>Type DELETE to confirm<input value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} autoComplete="off" required /></label>
              {deleteError && <p className="auth-message" role="alert">{deleteError}</p>}
              <div className="modal-actions"><button className="delete-account-button" type="submit">Delete my account</button><button className="cancel-edit-button" type="button" onClick={closeAction}>Cancel</button></div>
            </form>
          </>}
        </section>
      </div>}
    </section>
  )
}

function ProfilePage({ user, onNavigate, onSave, onLogout, onAccountDeleted, startEditing = false, darkTheme, onToggleTheme }) {
  const [editing, setEditing] = useState(startEditing)
  const [onboarding, setOnboarding] = useState(startEditing)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [tripCount, setTripCount] = useState(0)
  const [avatarStyle, setAvatarStyle] = useState(user.avatarStyle || 'sage')
  useEffect(() => {
    getTrips().then((trips) => setTripCount(trips.length)).catch(() => setTripCount(0))
  }, [])
  async function saveProfile(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const homeCity = data.get('homeCity').trim()
    const interests = data.getAll('interests')
    if (onboarding && !homeCity) {
      setError('Add your home city to continue.')
      return
    }
    if (onboarding && interests.length === 0) {
      setError('Choose at least one travel interest to continue.')
      return
    }
    try {
      setError('')
      await onSave({ name: data.get('name').trim(), homeCity, bio: data.get('bio').trim(), preferredBudget: data.get('preferredBudget'), travelPace: data.get('travelPace'), accessibilityNeeds: data.get('accessibilityNeeds').trim(), avatarStyle, interests })
      setSaved(true)
      setEditing(false)
      setOnboarding(false)
    } catch (requestError) {
      setSaved(false)
      setError(requestError.message)
    }
  }
  return (
    <div className="profile-page">
      <header className="public-header"><Brand onClick={() => { if (!onboarding) onNavigate('dashboard') }} /><div className="profile-header-actions"><ThemeToggle darkTheme={darkTheme} onToggle={onToggleTheme} />{!onboarding && <button className="auth-back" onClick={() => onNavigate('dashboard')}>← Back to overview</button>}</div></header>
      <main className="profile-content">
        <div className="profile-heading">
          <div><div className="section-kicker">{onboarding ? 'ONE LAST THING' : 'YOUR WAYFARER SPACE'}</div><h1>{onboarding ? 'Tell us about your travel style' : 'Your traveler profile'}</h1><p>{onboarding ? 'Add a few details so we can make your travel plans feel more personal.' : 'Keep a few details handy to make future trip planning feel more personal.'}</p></div>
          <button className="profile-logout" onClick={onLogout}>Log out</button>
        </div>
        <div className="profile-layout">
          <aside className="profile-summary">
            <Avatar name={user.name} email={user.email} size="large" variant={user.avatarStyle} /><h2>{user.name}</h2><p>{user.email}</p><span className="preview-badge">ACCOUNT PROFILE</span>
            <div className="profile-summary-rule"/><div className="profile-summary-label">TRIPS SAVED</div><strong className="profile-trip-count">{tripCount}</strong><small>Your saved trip outlines.</small>
          </aside>
          <section className="profile-edit-card">
            <div className="profile-card-heading"><div><div className="section-kicker">{onboarding ? 'PERSONALIZE YOUR PROFILE' : 'ABOUT YOU'}</div><h2>{onboarding ? 'A few details about you' : editing ? 'Edit your profile' : 'Your travel details'}</h2></div>{!editing && <button className="edit-profile-button" type="button" onClick={() => { setSaved(false); setAvatarStyle(user.avatarStyle || 'sage'); setEditing(true) }}>Edit profile <span>✎</span></button>}</div>
            <p className="profile-form-intro">{onboarding ? 'Your home city helps us plan trips from the right starting point.' : editing ? 'Update your details and save when you’re done.' : 'Your profile information and travel interests.'}</p>
            {editing ? (
              <form className="profile-form" onSubmit={saveProfile}>
                <label>Full name<input name="name" defaultValue={user.name} maxLength="100" required /></label>
                <label>Email address<input name="email" value={user.email} readOnly /></label>
                <fieldset className="avatar-style-fieldset"><legend>Choose your avatar</legend><div className="avatar-style-options">{avatarStyles.map((style) => <label className={avatarStyle === style ? 'selected' : ''} key={style}><input type="radio" name="avatarStyle" value={style} checked={avatarStyle === style} onChange={() => setAvatarStyle(style)} /><Avatar name={user.name} email={user.email} size="option" variant={style} /><span>{style[0].toUpperCase() + style.slice(1)}</span></label>)}</div><small className="password-hint">Pick a color style for your initials avatar.</small></fieldset>
                <label>Home city<input name="homeCity" defaultValue={user.homeCity || ''} placeholder="e.g. Indore" required={onboarding} /></label>
                <label>A little about you<textarea name="bio" rows="3" defaultValue={user.bio || ''} placeholder="What makes a trip memorable for you?" /></label>
                <label>Typical trip budget<select name="preferredBudget" defaultValue={user.preferredBudget || ''}><option value="">Choose a budget</option><option value="Economy">Economy</option><option value="Moderate">Moderate</option><option value="Premium">Premium</option><option value="Luxury">Luxury</option></select></label>
                <label>Travel pace<select name="travelPace" defaultValue={user.travelPace || ''}><option value="">Choose your pace</option><option value="Relaxed">Relaxed</option><option value="Balanced">Balanced</option><option value="Packed">Packed</option></select></label>
                <fieldset><legend>What do you love exploring?</legend><div className="interest-options">{['Beaches', 'Food', 'Culture', 'Nature', 'Adventure'].map((interest) => <label key={interest}><input type="checkbox" name="interests" value={interest} defaultChecked={user.interests?.includes(interest)} /><span>{interest}</span></label>)}</div>{onboarding && <small className="password-hint">Choose at least one interest.</small>}</fieldset>
                <label>Accessibility or travel needs<textarea name="accessibilityNeeds" rows="2" defaultValue={user.accessibilityNeeds || ''} placeholder="Anything you’d like us to keep in mind?" /></label>
                {error && <p className="auth-message" role="alert">{error}</p>}
                <div className="profile-actions"><button className="auth-submit" type="submit">{onboarding ? 'Save and continue' : 'Save changes'} <span>↗</span></button>{!onboarding && <button className="cancel-edit-button" type="button" onClick={() => { setError(''); setEditing(false) }}>Cancel</button>}</div>
              </form>
            ) : (
              <div className="profile-details">
                <div><span>FULL NAME</span><strong>{user.name}</strong></div>
                <div><span>EMAIL ADDRESS</span><strong>{user.email}</strong></div>
                <div><span>HOME CITY</span><strong>{user.homeCity || 'Add your home city'}</strong></div>
                <div><span>ABOUT ME</span><p>{user.bio || 'Add a few details about the way you like to travel.'}</p></div>
                <div><span>TRAVEL INTERESTS</span><div className="saved-interests">{user.interests?.length ? user.interests.map((interest) => <span key={interest}>{interest}</span>) : <p>Add the things you love exploring.</p>}</div></div>
                <div><span>TRIP BUDGET</span><strong>{user.preferredBudget || 'Not set'}</strong></div>
                <div><span>TRAVEL PACE</span><strong>{user.travelPace || 'Not set'}</strong></div>
                <div><span>ACCESSIBILITY OR TRAVEL NEEDS</span><p>{user.accessibilityNeeds || 'No specific needs added.'}</p></div>
              </div>
            )}
            {saved && !editing && <p className="saved-message profile-saved" role="status">Your profile changes have been saved.</p>}
          </section>
        </div>
        <AccountSecurity onAccountDeleted={onAccountDeleted} />
      </main>
    </div>
  )
}

function App() {
  const [page, setPage] = useState(() => pageFromPath(window.location.pathname))
  const [user, setUser] = useState(null)
  const [profileSetupRequired, setProfileSetupRequired] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState(() => new URLSearchParams(window.location.search).get('email') || '')
  const [darkTheme, setDarkTheme] = useState(() => {
    try { return window.localStorage.getItem('wayfarer-theme') === 'dark' } catch { return false }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', darkTheme)
    try { window.localStorage.setItem('wayfarer-theme', darkTheme ? 'dark' : 'light') } catch { /* Theme still works for this page view. */ }
  }, [darkTheme])

  function toggleTheme() {
    setDarkTheme((current) => !current)
  }

  function navigate(nextPage, { replace = false } = {}) {
    const nextPath = pagePaths[nextPage] || pagePaths.landing
    if (window.location.pathname !== nextPath) {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', nextPath)
    }
    setPage(nextPage)
  }

  function continueWithAccount(account) {
    setUser(account)
    const needsProfile = !account.homeCity || !account.interests?.length
    setProfileSetupRequired(needsProfile)
    navigate(needsProfile ? 'profile' : 'dashboard')
  }

  function registrationStarted(notice) {
    setVerificationEmail(notice.email)
    navigate('verifyEmail')
  }

  useEffect(() => {
    let active = true
    getCurrentUser().then((profile) => {
      if (active && profile) continueWithAccount(profile)
    }).catch(() => {}).finally(() => {
      if (active) setAuthChecked(true)
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    const handlePopState = () => setPage(pageFromPath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (authChecked && !user && (page === 'dashboard' || page === 'profile')) {
      navigate('login', { replace: true })
    }
  }, [authChecked, user, page])

  async function login(credentials) {
    continueWithAccount(await loginAccount(credentials))
  }
  async function saveProfile(profile) {
    const updatedProfile = await updateProfile(profile)
    setUser(updatedProfile)
    setProfileSetupRequired(false)
    return updatedProfile
  }
  function accountDeleted() {
    setUser(null)
    setProfileSetupRequired(false)
    navigate('landing')
  }
  async function logout() {
    await logoutAccount()
    setUser(null)
    navigate('landing')
  }

  if (!authChecked && (page === 'dashboard' || page === 'profile')) return <div className="route-loading">Loading your account…</div>
  if ((page === 'dashboard' || page === 'profile') && !user) return <AuthPage mode="login" onNavigate={navigate} onLogin={login} darkTheme={darkTheme} onToggleTheme={toggleTheme} />
  if (page === 'verifyEmail') return <EmailVerificationPage initialEmail={verificationEmail} onNavigate={navigate} darkTheme={darkTheme} onToggleTheme={toggleTheme} />
  if (page === 'signup' || page === 'login') return <AuthPage mode={page} onNavigate={navigate} onAccountCreated={registrationStarted} onLogin={login} darkTheme={darkTheme} onToggleTheme={toggleTheme} />
  if (page === 'profile' && user) return <ProfilePage user={user} onNavigate={navigate} onSave={saveProfile} onLogout={logout} onAccountDeleted={accountDeleted} startEditing={profileSetupRequired} darkTheme={darkTheme} onToggleTheme={toggleTheme} />
  if (page === 'dashboard' && user) return <Dashboard user={user} onNavigate={navigate} darkTheme={darkTheme} onToggleTheme={toggleTheme} />
  return <LandingPage onNavigate={navigate} darkTheme={darkTheme} onToggleTheme={toggleTheme} />
}

export default App
