import { NextFunction, Request, Response, Router } from 'express';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { COVERS_PATH, OPEN_LIBRARY_COVERS_API } from '../const';

const router = Router();

// TODO: change method?
/**
 * Fetches a book cover from Open Library API and saves it to the server
 */
router.get('/cover', async (req: Request, res: Response, next: NextFunction) => {
  const { coverId, bookId, isbn } = req.query;

  if (!existsSync(COVERS_PATH)) {
    mkdirSync(COVERS_PATH);
  }

  if (!bookId || (!coverId && !isbn)) {
    res.status(400).send('Invalid request');
    next();
    return;
  }

  if (existsSync(`${COVERS_PATH}/${coverId}.jpg`)) {
    res.send('Cover already exists');
    next();
    return;
  }

  const url = isbn
    ? `${OPEN_LIBRARY_COVERS_API}/b/isbn/${isbn}-M.jpg`
    : `${OPEN_LIBRARY_COVERS_API}/b/id/${coverId}-M.jpg`;

  try {
    const data = await fetch(url).then((response) => response.arrayBuffer());
    writeFileSync(`${COVERS_PATH}/${bookId}.jpg`, Buffer.from(data));
    res.send({ status: 'Cover updated' });
  } catch {
    res.status(404).send('Cover not found');
  }
});

export { router as openLibraryRouter };
