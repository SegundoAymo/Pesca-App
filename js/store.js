// Versioned storage on the phone. Every value is saved as { v, data } so the format
// can change later without losing what is saved. Never throws: storage can be blocked.

const PREFIX = 'kitpesca:';

export function load(key, version, fallback, migrate) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    const saved = JSON.parse(raw);
    if (saved.v === version) return saved.data;
    if (migrate) return migrate(saved.v, saved.data) ?? fallback;
    return fallback;
  } catch {
    return fallback;
  }
}

export function save(key, version, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ v: version, data }));
    return true;
  } catch {
    return false;
  }
}
