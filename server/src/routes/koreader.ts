import Database from 'better-sqlite3';
import { NextFunction, Request, Response, Router } from 'express';
import path from 'path';
import { COVERS_PATH, DB_PATH } from '../const';

const router = Router();

// FIXME: hacky :)
declare global {
  namespace Express {
    interface Request {
      db?: Database.Database;
    }
  }
}

function dbMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.db = new Database(DB_PATH, { fileMustExist: true });
      res.on('finish', () => req.db?.close());
      next();
    } catch (error) {
      next(error);
    }
  };
}

router.get('/books', dbMiddleware(), (req: Request, res: Response) => {
  const books = req.db?.prepare('SELECT * FROM book').all();
  res.json(books);
});

router.get('/books/:id', dbMiddleware(), (req: Request, res: Response, next: NextFunction) => {
  const book = req.db?.prepare('SELECT * FROM book WHERE id = ?').get(req.params.id) as any;

  if (!book) {
    res.status(404).json({ error: 'Book not found' });
    next();
    return;
  }

  const stats = req.db
    ?.prepare('SELECT * FROM page_stat_data WHERE id_book = ?')
    .all(req.params.id);
  res.json({ ...book, stats });
});

router.delete('/books/:id', dbMiddleware(), (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    req.db?.prepare('DELETE FROM page_stat_data WHERE id_book = ?').run(id);
    const result = req.db?.prepare('DELETE FROM book WHERE id = ?').run(id);

    if (result && result.changes > 0) {
      res.status(200).send({ success: true, message: `Item with ID ${id} deleted.` });
    } else {
      res.status(404).send({ success: false, message: `No item found with ID ${id}.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

router.get('/stats', dbMiddleware(), (req: Request, res: Response) => {
  const stats = req.db?.prepare('SELECT * FROM page_stat_data').all();
  res.json(stats);
});

router.get('/stats/:id', dbMiddleware(), (req: Request, res: Response) => {
  const book = req.db?.prepare('SELECT * FROM page_stat_data WHERE id_book = ?').all(req.params.id);
  res.json(book);
});

router.get('/books/:id/cover', (req: Request, res: Response) => {
  res.sendFile(`${COVERS_PATH}/${req.params.id}.jpg`, (err) => {
    if (err) {
      res.status(404).send('Cover not found');
    }
  });
});

export { router as koreaderRouter };
