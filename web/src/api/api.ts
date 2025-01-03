export const API_URL = `${import.meta.env.VITE_API_URL ?? ''}/api`;

export async function fetchFromAPI<T>(endpoint: string, method: string = 'get') {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch data, ${method} ${endpoint}`);
  }
  return response.json() as Promise<T>;
}
