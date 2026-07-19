// in local dev this stays empty and vite's proxy (see vite.config.js) handles /api requests.
// in production (vercel) we set VITE_API_URL to the deployed backend's url (on render).
export const API_BASE = import.meta.env.VITE_API_URL || '';
