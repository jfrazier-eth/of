export function extractCookie(key: string, cookies: string): string | null {
  const regex = new RegExp(`${key}=([^ ;]+)`, "g");
  const matches = cookies.matchAll(regex);

  const firstMatch = matches.next().value;

  if (!firstMatch || firstMatch.length === 0) {
    return null;
  }

  return firstMatch[1];
}
