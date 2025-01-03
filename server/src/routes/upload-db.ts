import Database from 'better-sqlite3';
import { Router } from 'express';
import { unlinkSync } from 'fs';
import multer from 'multer';
import { DATA_PATH, DB_FILENAME } from '../const';

const storage = multer.diskStorage({
  destination: (_req, _res, cb) => {
    cb(null, DATA_PATH); // Set upload directory
  },
  filename: (_req, _res, cb) => {
    cb(null, DB_FILENAME); // Set file name
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

router.post('/upload', upload.single('file'), (req, res, next) => {
  const uploadedFilePath = req.file?.path;
  console.log('Uploading file', req.file);

  if (!uploadedFilePath) {
    res.status(400).json({ error: 'No file uploaded' });
    next();
    return;
  }

  try {
    const db = new Database(uploadedFilePath, { readonly: true });
    const bookIds = db.prepare('SELECT id FROM book').all();

    if (!bookIds.length) {
      throw new Error('No books found in the uploaded file');
    }

    db.close();

    res.json({ message: 'File uploaded and validated successfully' });
  } catch (err) {
    unlinkSync(uploadedFilePath); // Clean up the uploaded file
    console.error(err);
    res.status(500).json({ error: 'Invalid SQLite file or unable to read the file' });
  }
});

export { router as uploadRouter };
