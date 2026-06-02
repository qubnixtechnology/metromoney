export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const TOKEN_KEY = 'bharat_token';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(headers = {}) {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}`, ...headers } : headers;
}

export async function apiRequest(path, options = {}) {
  if (!API_BASE) throw new Error('Demo mode');

  const response = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders({ 'Content-Type': 'application/json', ...(options.headers || {}) }),
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload;
}

export async function apiUpload(path, formData) {
  if (!API_BASE) throw new Error('Demo mode');

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Upload failed');
  return payload;
}
