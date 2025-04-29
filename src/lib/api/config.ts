import { OpenAPI } from './core/OpenAPI';

// Get environment variables with fallbacks
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || '/api/v1';

// Configure the OpenAPI client
OpenAPI.BASE = API_BASE;
OpenAPI.VERSION = API_VERSION;
OpenAPI.WITH_CREDENTIALS = false;
OpenAPI.CREDENTIALS = 'include';

// Add a token resolver to automatically add the auth token to requests
OpenAPI.TOKEN = async () => {
  const token = localStorage.getItem('auth_token');
  return token || '';
};

// Helper function to get the full API URL with version
export function getApiUrl(path: string): string {
  return `${OpenAPI.BASE}${OpenAPI.VERSION}${path}`;
} 