import { OpenAPI } from './core/OpenAPI';
import { getAuthToken } from './auth_helper';

// Get environment variables with fallbacks
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
export const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// Configure the OpenAPI client
OpenAPI.BASE = `${API_BASE}/api`;
OpenAPI.VERSION = API_VERSION;
OpenAPI.WITH_CREDENTIALS = false;
OpenAPI.CREDENTIALS = 'include';

// Add a token resolver to automatically add the auth token to requests
OpenAPI.TOKEN = async () => {
  const token = getAuthToken();
  return token || '';
}; 