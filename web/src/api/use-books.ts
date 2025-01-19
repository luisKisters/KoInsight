import useSWR from 'swr';
import { API_URL, fetchFromAPI } from './api';
import { Book } from '@/common/types/book';

export function useBooks() {
  return useSWR('books', () => fetchFromAPI<Book[]>('books'));
}

export async function deleteBook(id: string | number) {
  const response = await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error('Failed to delete the book');
  }
  return response.json();
}
