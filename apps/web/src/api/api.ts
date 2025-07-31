// API configuration with proper fallbacks for different environments
const getApiBaseUrl = () => {
  // If VITE_WEB_API_URL is set, use it
  if (import.meta.env.VITE_WEB_API_URL) {
    return import.meta.env.VITE_WEB_API_URL;
  }

  // In development, default to localhost:3000 (server port)
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }

  // In production, use relative URL (same domain)
  return '';
};

export const API_URL = `${getApiBaseUrl()}/api`;
export const SERVER_URL = getApiBaseUrl();

export async function fetchFromAPI<T>(
  endpoint: string,
  method: string = 'GET',
  body: Record<string, unknown> | null = null
) {
  let searchParams: string = '';

  if (method === 'GET' && body) {
    let tempSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      tempSearchParams.set(key, String(value));
    }

    searchParams = `?${tempSearchParams.toString()}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}${searchParams}`, {
    method,
    body: method !== 'GET' && body ? JSON.stringify(body) : null,
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data, ${method} ${endpoint}`);
  }
  return response.json() as Promise<T>;
}
