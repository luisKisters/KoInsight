export type PageStat = {
  book_id: number;
  page: number;
  start_time: number;
  duration: number;
  total_pages: number;
};

export type DbPageStat = Omit<PageStat, 'book_id'> & { id_book: number };
