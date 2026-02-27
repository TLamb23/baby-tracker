const STORAGE_KEY = 'baby-tracker-feedings'
const SETTINGS_KEY = 'baby-tracker-settings'

function getSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function saveSettings(patch) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...getSettings(), ...patch }))
}

export function getSex() {
  return getSettings().sex ?? 'girl'
}

export function setSex(sex) {
  saveSettings({ sex })
}

export function getTheme() {
  return getSettings().theme ?? 'light'
}

export function setTheme(theme) {
  saveSettings({ theme })
}

export function getLastFeeding() {
  const all = getAllFeedings()
  const feeds = all.filter(f => ['breast', 'formula', 'solid'].includes(f.type))
  if (!feeds.length) return null
  return feeds.reduce((latest, f) =>
    new Date(f.timestamp) > new Date(latest.timestamp) ? f : latest
  )
}

export function getAllFeedings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getFeedingsForDate(dateStr) {
  const all = getAllFeedings()
  return all.filter(entry => entry.timestamp.startsWith(dateStr))
}

export function addFeeding(entry) {
  const all = getAllFeedings()
  all.push({ ...entry, id: crypto.randomUUID() })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function deleteFeeding(id) {
  const all = getAllFeedings()
  const updated = all.filter(entry => entry.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
