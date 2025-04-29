import { OpenAPI } from './core/OpenAPI';

// Configure the OpenAPI client
OpenAPI.BASE = 'http://localhost:8000';
OpenAPI.VERSION = '/api/v1';
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