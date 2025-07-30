export function getLoggedInUserName(): string | null {
  if (typeof window === 'undefined') return null;
  const name = sessionStorage.getItem('clientName');
  return name;
}
