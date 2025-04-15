import { GetAllStatsResponse } from '@koinsight/common/types';
import { Request, Response, Router } from 'express';
import { StatsRepository } from './stats-repository';
import { StatsService } from './stats-service';

const router = Router();

/**
 * Get all stats
 */
router.get('/', async (_: Request, res: Response) => {
  const stats = await StatsRepository.getAll();
  const perMonth = StatsService.getPerMonthReadingTime(stats);
  const perDayOfTheWeek = StatsService.perDayOfTheWeek(stats);

  const response: GetAllStatsResponse = { stats, perMonth, perDayOfTheWeek };

  res.json(response);
});

/**
 * Get stats by book md5
 */
router.get('/:book_md5', async (req: Request, res: Response) => {
  const book = await StatsRepository.getByBookMD5(req.params.book_md5);
  res.json(book);
});

export { router as statsRouter };
