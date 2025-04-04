import { NextFunction, Request, Response, Router } from 'express';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { COVERS_PATH } from '../const';
import { fetchCover, queryCovers } from '../lib/open-library';

const router = Router();

router.get('/list-covers', async (req: Request, res: Response, next: NextFunction) => {
  const { searchTerm, limit } = req.query;

  queryCovers(searchTerm as string, Number(limit))
    .then((covers) => {
      res.send(covers);
    })
    .catch((error) => {
      res.status(500).send('Error fetching covers');
      next(error);
    });
});

// TODO: change method?
/**
 * Fetches a book cover from Open Library API and saves it to the server
 */
router.get('/cover', async (req: Request, res: Response, next: NextFunction) => {
  const { coverId, bookId, size = 'M' } = req.query;

  if (!bookId || !coverId) {
    res.status(400).send('Invalid request');
    return next();
  }

  if (!existsSync(COVERS_PATH)) {
    mkdirSync(COVERS_PATH);
  }

  try {
    const cover = await fetchCover(coverId as string, size as 'S' | 'M' | 'L');
    writeFileSync(`${COVERS_PATH}/${bookId}.jpg`, Buffer.from(cover));
    res.send({ status: 'Cover updated' });
  } catch {
    res.status(404).send('Cover not found');
  }
});

export { router as openLibraryRouter };
