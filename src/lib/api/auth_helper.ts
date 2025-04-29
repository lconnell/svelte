/**
 * Authentication helper functions for managing tokens
 */

/**
 * Get the authentication token from localStorage
 * @returns The authentication token or null if not found
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('access_token');
}

/**
 * Set the authentication token in localStorage
 * @param token The authentication token to store
 */
export function setAuthToken(token: string): void {
  localStorage.setItem('access_token', token);
}

/**
 * Remove the authentication token from localStorage
 */
export function removeAuthToken(): void {
  localStorage.removeItem('access_token');
}

/**
 * Check if the user is authenticated
 * @returns True if the user is authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Get the authorization header for API requests
 * @returns The authorization header or null if not authenticated
 */
export function getAuthHeader(): { Authorization: string } | null {
  const token = getAuthToken();
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
} 