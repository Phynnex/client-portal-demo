export function getLoggedInUserName(): string | null {
  if (typeof window === 'undefined') return null;
  const name = localStorage.getItem('clientName');
  return name;
}
