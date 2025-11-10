export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
