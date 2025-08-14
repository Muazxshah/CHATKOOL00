const AUTH_TOKEN_KEY = 'chatkool_auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Check if token is expired (simple JWT decode)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
}

export function logout(): void {
  clearAuthToken();
  window.location.href = '/';
}
