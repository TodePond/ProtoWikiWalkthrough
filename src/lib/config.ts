export type ConfigTheme = 'light' | 'dark' | 'system'
export type ConfigUser = 'logged-out' | 'new' | 'experienced'

export interface Config {
  theme: ConfigTheme
  user: ConfigUser
}

export const DEFAULT_CONFIG: Config = {
  theme: 'system',
  user: 'logged-out',
}

const STORAGE_KEY = 'protowiki-prototype-user-config'

const VALID_THEMES: ConfigTheme[] = ['light', 'dark', 'system']
const VALID_USERS: ConfigUser[] = ['logged-out', 'new', 'experienced']

function isConfigTheme(value: unknown): value is ConfigTheme {
  return typeof value === 'string' && VALID_THEMES.includes(value as ConfigTheme)
}

function isConfigUser(value: unknown): value is ConfigUser {
  return typeof value === 'string' && VALID_USERS.includes(value as ConfigUser)
}

export function loadConfig(): Config {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_CONFIG }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_CONFIG }

    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) {
      return { ...DEFAULT_CONFIG }
    }

    const record = parsed as Record<string, unknown>
    return {
      theme: isConfigTheme(record.theme) ? record.theme : DEFAULT_CONFIG.theme,
      user: isConfigUser(record.user) ? record.user : DEFAULT_CONFIG.user,
    }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export function saveConfig(config: Config): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // Quota or private-mode failures — ignore.
  }
}
