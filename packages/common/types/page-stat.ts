export type CommonPageStat = {
  page: number;
  start_time: number;
  duration: number;
  total_pages: number;
};

export type PageStat = CommonPageStat & {
  device_id: string;
  book_md5: string;
};

export type DbPageStat = CommonPageStat & { id_book: number };
