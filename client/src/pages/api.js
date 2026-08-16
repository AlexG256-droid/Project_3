import { API_BASE } from './apiBase.js';

export async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed.');
  return data;
}

export async function getCurrentUser() {
  const data = await request('/api/auth/me');
  return data.user;
}

export async function register(username, password) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return data.user;
}

export async function login(username, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return data.user;
}

export async function logout() {
  await request('/api/auth/logout', { method: 'POST' });
}

function toLabel(value) {
  const [year, month, day] = value.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return '';
  return `${toLabel(startDate)} - ${toLabel(endDate)}`;
}

const SPECIAL_CHAR = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`;']/;

export function getPasswordChecks(password) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    special: SPECIAL_CHAR.test(password),
  };
}

export function validateSignup(username, password) {
  const newErrors = {};
  const trimmedUsername = username.trim();

  // kept short so the message never wraps to a second line and grows the box
  if (!trimmedUsername) {
    newErrors.username = 'Username is required.';
  } else if (/^\d+$/.test(trimmedUsername)) {
    newErrors.username = 'Username cannot be a number.';
  } else if (trimmedUsername.length < 3) {
    newErrors.username = 'Username needs 3+ characters.';
  }

  const checks = getPasswordChecks(password);
  if (!password) {
    newErrors.password = 'Password is required.';
  } else if (!checks.length || !checks.uppercase || !checks.special) {
    newErrors.password = 'Password does not meet all requirements.';
  }

  return newErrors;
}

export function validateDates(startDate, endDate) {
  const newErrors = {};
  if (!startDate) {
    newErrors.startDate = 'Arrival date is required.';
  }
  if (!endDate) {
    newErrors.endDate = 'Departure date is required.';
  }
  // 'YYYY-MM-DD' strings compare correctly, so no need to build Date objects
  if (startDate && endDate && endDate < startDate) {
    newErrors.endDate = 'Departure date cannot be before the arrival date.';
  }
  return newErrors;
}
