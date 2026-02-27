const BASE = 'https://api.lambert-hq.com'

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export async function getFeedings() {
  return req('/feedings')
}

export async function getFeedingsForDate(dateStr) {
  return req(`/feedings/date/${dateStr}`)
}

export async function getLastFeeding() {
  const all = await req('/feedings')
  const feeds = all.filter(f => ['breast', 'formula', 'solid'].includes(f.type))
  if (!feeds.length) return null
  return feeds.reduce((latest, f) =>
    new Date(f.timestamp) > new Date(latest.timestamp) ? f : latest
  )
}

export async function addFeeding(entry) {
  return req('/feedings', { method: 'POST', body: JSON.stringify(entry) })
}

export async function deleteFeeding(id) {
  return req(`/feedings/${id}`, { method: 'DELETE' })
}

export async function getSettings() {
  return req('/settings')
}

export async function saveSettings(patch) {
  return req('/settings', { method: 'PUT', body: JSON.stringify(patch) })
}

export async function getSex() {
  const s = await getSettings()
  return s.sex ?? 'girl'
}

export async function setSex(sex) {
  return saveSettings({ sex })
}

export async function getTheme() {
  const s = await getSettings()
  return s.theme ?? 'light'
}

export async function setTheme(theme) {
  return saveSettings({ theme })
}

export async function getBirthday() {
  const s = await getSettings()
  return s.birthday ?? null
}

export async function setBirthday(birthday) {
  return saveSettings({ birthday })
}

export async function getBabyName() {
  const s = await getSettings()
  return s.babyName ?? null
}

export async function setBabyName(babyName) {
  return saveSettings({ babyName })
}
