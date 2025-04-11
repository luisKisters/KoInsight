import { startOfDay } from 'date-fns/startOfDay';
import { NextFunction, Request, Response, Router } from 'express';
import { existsSync, mkdirSync, promises, rename, unlink } from 'fs';
import multer from 'multer';
import path from 'path';
import { COVERS_PATH } from '../const';
import { BookRepository } from '../db/book-repository';
import { PageStatRepository } from '../db/page-stat-repository';
import { deleteExistingCover } from '../lib/covers';
import { getBookById } from '../middleware/get-book-by-id';

const router = Router();

router.get('/books', async (_: Request, res: Response) => {
  const books = await BookRepository.getAllWithGenres();
  res.json(books);
});

router.get('/books/:id', getBookById, async (req: Request, res: Response, next: NextFunction) => {
  const book = req.book!;

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

router.get('/books/:id/cover', getBookById, async (req: Request, res: Response) => {
  const book = req.book!;

  try {
    // find file by md5 with any extension
    const files = await promises.readdir(COVERS_PATH);
    const file = files.find((f) => f.startsWith(book.md5!));

    if (file) {
      res.sendFile(`${COVERS_PATH}/${file}`);
    } else {
      res.status(404).send('Cover not found');
    }
  } catch (error) {
    console.error('Error reading cover directory:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

const upload = multer({
  dest: COVERS_PATH,
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
    if (
      file.mimetype === 'application/octet-stream' ||
      allowedExtensions.some((ext) => file.originalname.endsWith(ext))
    ) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error(`Only ${allowedExtensions.join(', ')} files are allowed`));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

/**
 * Uploads a book cover
 */
router.post(
  '/books/:id/cover',
  getBookById,
  async (req: Request, _res: Response, next: NextFunction) => {
    console.log('Deleting existing cover for book', req.book!.md5);
    await deleteExistingCover(req.book!.md5!);
    next();
  },
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    const book = req.book!;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'Missing file upload' });
      return next();
    }

    try {
      if (!existsSync(COVERS_PATH)) {
        mkdirSync(COVERS_PATH, { recursive: true });
      }

      const extension = path.extname(file.originalname) || '';
      const newFilename = `${book.md5}${extension}`;
      const newPath = path.join(path.dirname(file.path), newFilename);
      await rename(file.path, newPath, () => {});

      res.send({ message: 'Cover updated' });
    } catch (error) {
      // Cleanup uploaded file if there's an error
      if (file?.path) {
        try {
          unlink(file.path, () => {});
        } catch (_) {
          // ignore cleanup errors
        }
      }
      console.log('Error uploading cover:', error);
      res.status(500).send({ message: 'Unable to update cover' });
    }
  }
);

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
