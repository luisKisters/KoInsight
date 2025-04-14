import { GetAllStatsResponse } from '@koinsight/common/types';
import { format } from 'date-fns/format';
import { Request, Response, Router } from 'express';
import { PageStatRepository } from '../db/page-stat-repository';

const router = Router();

router.get('/stats', async (_: Request, res: Response) => {
  const stats = await PageStatRepository.getAll();

  const perMonth = (stats ?? [])
    .reduce<{ month: string; duration: number; date: number }[]>((acc, stat) => {
      const month = format(stat.start_time * 1000, 'MMMM yyyy');
      const monthData = acc.find((item) => item.month === month);
      if (monthData) {
        monthData.duration += stat.duration;
      } else {
        acc.push({ month, duration: stat.duration, date: stat.start_time });
      }

      return acc;
    }, [])
    .sort((a, b) => a.date - b.date);

  const response: GetAllStatsResponse = {
    stats,
    per_month: perMonth,
  };

  res.json(response);
});

router.get('/stats/:book_md5', async (req: Request, res: Response) => {
  const book = await PageStatRepository.getByBookMD5(req.params.book_md5);
  res.json(book);
});

export { router as statsRouter };
