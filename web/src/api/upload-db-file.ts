import { API_URL } from './api';

export function uploadDbFile(formData: FormData) {
  return fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'multipart/form-data',
    },
  });
}
