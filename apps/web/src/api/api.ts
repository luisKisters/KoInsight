export const API_URL = `${import.meta.env.VITE_WEB_API_URL ?? ''}/api`;
export const SERVER_URL = `${import.meta.env.VITE_WEB_API_URL ?? ''}`;

export async function fetchFromAPI<T>(
  endpoint: string,
  method: string = 'GET',
  body: unknown | null = null
) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data, ${method} ${endpoint}`);
  }
  return response.json() as Promise<T>;
}
