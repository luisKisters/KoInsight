import { Request, Response, Router } from 'express';
import { PageStatRepository } from '../db/page-stat-repository';

const router = Router();

router.get('/stats', async (_: Request, res: Response) => {
  const stats = await PageStatRepository.getAll();

  res.json(stats);
});

router.get('/stats/:book_md5', async (req: Request, res: Response) => {
  const book = await PageStatRepository.getByBookMD5(req.params.book_md5);
  res.json(book);
});

export { router as statsRouter };
