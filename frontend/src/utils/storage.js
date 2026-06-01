export function storageGet(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function storageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

