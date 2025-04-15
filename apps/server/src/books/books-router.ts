import { NextFunction, Request, Response, Router } from 'express';
import { BooksRepository } from './books-repository';
import { BooksService } from './books-service';
import { coversRouter } from './covers/covers-router';
import { getBookById } from './get-book-by-id-middleware';

const router = Router();

router.use('/:bookId/cover', coversRouter);

/**
 * Get all books with attached entity data
 */
router.get('/', async (_: Request, res: Response) => {
  const books = await BooksRepository.getAllWithData();
  res.json(books);
});

/**
 * Get a book with attached entity data by ID
 */
router.get('/:bookId', getBookById, async (req: Request, res: Response, next: NextFunction) => {
  const book = req.book!;
  const bookWithData = await BooksService.withData(book);
  res.json(bookWithData);
});

/**
 * Delete a book by ID
 */
router.delete('/:bookId', async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await BooksRepository.softDelete(Number(id));
    res.status(200).json({ message: 'Book deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

/**
 * Adds a new genre to a book
 */
router.post('/:bookId/genres', getBookById, async (req: Request, res: Response) => {
  const book = req.book!;
  const { genreName } = req.body;

  if (!genreName) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    await BooksRepository.addGenre(book.md5, genreName);
    res.status(200).json({ message: 'Genre added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add genre' });
  }
});

/**
 * Updates a book's reference pages
 */
router.put('/:bookId/reference_pages', getBookById, async (req: Request, res: Response) => {
  const book = req.book!;
  const { reference_pages } = req.body;

  if (!reference_pages) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    await BooksRepository.setReferencePages(book.id, reference_pages);
    res.status(200).json({ message: 'Reference pages updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update reference pages' });
  }
});

export { router as booksRouter };
