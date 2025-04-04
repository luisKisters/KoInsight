import { Request, Response, Router } from 'express';
import { PageStatRepository } from '../db/page-stat-repository';

const router = Router();

router.get('/stats', async (_: Request, res: Response) => {
  const stats = await PageStatRepository.getAll();

  res.json(stats);
});

router.get('/stats/:id', async (req: Request, res: Response) => {
  const book = await PageStatRepository.getByBookId(Number(req.params.id));
  res.json(book);
});

export { router as statsRouter };
