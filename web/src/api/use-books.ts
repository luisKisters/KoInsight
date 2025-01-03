import useSWR from 'swr';
import { API_URL, fetchFromAPI } from './api';

export type Book = {
  id: number;
  title: string;
  authors: string;
  notes: number;
  last_open: number;
  highlights: number;
  pages: number;
  series: string;
  total_read_time: number;
  total_read_pages: number;
};

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
