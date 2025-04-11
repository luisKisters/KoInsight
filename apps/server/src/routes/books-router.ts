import { startOfDay } from 'date-fns/startOfDay';
import { NextFunction, Request, Response, Router } from 'express';
import { COVERS_PATH } from '../const';
import { BookRepository } from '../db/book-repository';
import { PageStatRepository } from '../db/page-stat-repository';

const router = Router();

router.get('/books', async (_: Request, res: Response) => {
  const books = await BookRepository.getAllWithGenres();
  res.json(books);
});

router.get('/books/:id', async (req: Request, res: Response, next: NextFunction) => {
  const book = await BookRepository.getByIdWithGenres(Number(req.params.id));

  if (!book) {
    res.status(404).json({ error: 'Book not found' });
    next();
    return;
  }

  const stats = await PageStatRepository.getByBookId(Number(req.params.id));

  const started_reading = stats.reduce((acc, stat) => Math.min(acc, stat.start_time), Infinity);

  const read_per_day = stats.reduce(
    (acc, stat) => {
      const day = startOfDay(stat.start_time * 1000).getTime();
      acc[day] = (acc[day] || 0) + stat.duration;

      return acc;
    },
    {} as Record<string, number>
  );

  res.json({ ...book, stats, started_reading, read_per_day });
});

router.delete('/books/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await BookRepository.softDelete(Number(id));
    res.status(200).json({ message: 'Book deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

router.get('/books/:id/cover', async (req: Request, res: Response) => {
  const bookId = req.params.id;
  if (!bookId) {
    res.status(400).send('Book ID is required');
    return;
  }
  // Find book by id
  const book = await BookRepository.getById(Number(bookId));
  if (!book) {
    res.status(404).send('Book not found');
    return;
  }

  res.sendFile(`${COVERS_PATH}/${book.md5}.jpg`, (err) => {
    if (err) {
      res.status(404).send('Cover not found');
    }
  });
});

router.post('/books/:id/genres', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { genreName } = req.body;

  if (!id || !genreName) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    await BookRepository.addGenre(Number(id), genreName);
    res.status(200).json({ message: 'Genre added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add genre' });
  }
});

export { router as booksRouter };
