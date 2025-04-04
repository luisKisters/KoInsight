import { Book } from '@kobuddy/common/types/book';
import { fetchFromAPI } from './api';

export function saveCover(bookId: Book['id'], coverId: string) {
  const params = new URLSearchParams({
    bookId: bookId.toString(),
    coverId,
  });

  return fetchFromAPI(`cover?${params}`);
}

export function listCovers(searchTerm: string, limit: number = 3) {
  const params = new URLSearchParams({
    searchTerm,
    limit: String(limit),
  });

  return fetchFromAPI<string[]>(`list-covers?${params.toString()}`);
}
