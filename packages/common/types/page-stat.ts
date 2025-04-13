export type PageStat = {
  device_id: string;
  book_md5: string;
  page: number;
  start_time: number;
  duration: number;
  total_pages: number;
};

export type DbPageStat = Omit<PageStat, 'book_id'> & { id_book: number };
