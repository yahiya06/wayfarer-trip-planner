const apiBase = '/api'

async function readResponse(response) {
  if (response.status === 204) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data?.detail || data?.message || `Request failed (${response.status}).`
    throw new Error(message)
  }
  return data
}

async function getCsrfToken() {
  const response = await fetch(`${apiBase}/auth/csrf`, { credentials: 'include' })
  const data = await readResponse(response)
  return data.token
}

async function sendJson(path, method, body) {
  const token = await getCsrfToken()
  const response = await fetch(`${apiBase}${path}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': token },
    body: JSON.stringify(body),
  })
  return readResponse(response)
}

export function registerAccount(details) {
  return sendJson('/auth/register', 'POST', details)
}

export function verifyEmail(token) {
  return sendJson('/auth/verify-email', 'POST', { token })
}

export function resendVerification(email) {
  return sendJson('/auth/resend-verification', 'POST', { email })
}

export function loginAccount(credentials) {
  return sendJson('/auth/login', 'POST', credentials)
}

export async function getCurrentUser() {
  const response = await fetch(`${apiBase}/auth/me`, { credentials: 'include' })
  if (response.status === 401) return null
  return readResponse(response)
}

export async function updateProfile(profile) {
  return sendJson('/users/me', 'PATCH', profile)
}

export async function changePassword(details) {
  return sendJson('/users/me/password', 'PUT', details)
}

export async function deleteAccount(details) {
  return sendJson('/users/me', 'DELETE', details)
}

export async function getTrips() {
  const response = await fetch(`${apiBase}/trips`, { credentials: 'include' })
  return readResponse(response)
}

export async function createTrip(trip) {
  return sendJson('/trips', 'POST', trip)
}

export async function deleteTrip(tripId) {
  return sendJson(`/trips/${tripId}`, 'DELETE')
}

export async function logoutAccount() {
  const token = await getCsrfToken()
  const response = await fetch(`${apiBase}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-XSRF-TOKEN': token },
  })
  return readResponse(response)
}
