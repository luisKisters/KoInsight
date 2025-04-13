import { Book, KoReaderBook } from '@koinsight/common/types/book';
import { DbPageStat } from '@koinsight/common/types/page-stat';
import Database from 'better-sqlite3';
import { Router } from 'express';
import { unlinkSync } from 'fs';
import multer from 'multer';
import { DATA_PATH, UPLOAD_DB_FILENAME } from '../const';
import { transformPageStats, uploadStatisticData } from '../db/upload-data';

const storage = multer.diskStorage({
  destination: (_req, _res, cb) => {
    cb(null, DATA_PATH); // Set upload directory
  },
  filename: (_req, _res, cb) => {
    cb(null, UPLOAD_DB_FILENAME); // Set file name
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/octet-stream' || file.originalname.endsWith('.sqlite3')) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only .sqlite3 files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.post('/upload', upload.single('file'), async (req, res, next) => {
  const uploadedFilePath = req.file?.path;

  if (!uploadedFilePath) {
    res.status(400).json({ error: 'No file uploaded' });
    next();
    return;
  }

  let db;
  try {
    db = new Database(uploadedFilePath, { readonly: true });
    const bookIds = db.prepare('SELECT id FROM book').all();

    if (!bookIds.length) {
      throw new Error('No books found in the uploaded file');
    }
  } catch (err) {
    unlinkSync(uploadedFilePath); // Clean up the uploaded file
    console.error(err);
    res.status(500).json({ error: 'Invalid SQLite file or unable to read the file' });
    return;
  }

  try {
    const newBooks = db.prepare('SELECT * FROM book').all() as KoReaderBook[];
    const dbPageStats = db.prepare('SELECT * FROM page_stat_data').all() as DbPageStat[];
    const newPageStats = transformPageStats(dbPageStats);

    await uploadStatisticData(newBooks, newPageStats);

    res.json({ message: 'Database imported successfully' });
  } catch (err) {
    console.error(err);
    db.close();
    res.status(500).json({ error: 'Failed to import database' });
  } finally {
    db.close();
    unlinkSync(uploadedFilePath);
  }
});

export { router as uploadRouter };
