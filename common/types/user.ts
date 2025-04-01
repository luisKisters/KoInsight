export type User = {
  id: number;
  username: string;
  authors: string;
  notes: number;
  last_open: number;
  highlights: number;
  pages: number;
  series: string | null;
  language: string | null;
  md5: string | null;
  total_read_time: number;
  total_read_pages: number;
};
