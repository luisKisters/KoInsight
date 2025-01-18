export type PageStat = {
  id_book: number;
  page: number;
  start_time: number;
  duration: number;
  total_pages: number;
};

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
