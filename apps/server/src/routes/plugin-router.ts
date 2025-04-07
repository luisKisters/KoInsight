import { Book } from '@kobuddy/common/types/book';
import { PageStat } from '@kobuddy/common/types/page-stat';
import archiver from 'archiver';
import { Router } from 'express';
import path from 'path';
import { transformPageStats, uploadStatisticData } from '../db/upload-data';

// Router for kobuddy koreader plugin
const router = Router();

router.post('/plugin/import', async (req, res) => {
  const contentLength = req.headers['content-length'];
  console.warn(`[${req.method}] ${req.url} — Content-Length: ${contentLength || 'unknown'} bytes`);

  const newBooks: Book[] = req.body.books;
  const newPageStats: PageStat[] = transformPageStats(req.body.stats);

  try {
    await uploadStatisticData(newBooks, newPageStats);
    res.status(200).json({ message: 'Upload successfull' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error importing data' });
  }
});

// TODO: implement check in koreader plugin
router.get('/plugin/health', async (_, res) => {
  res.status(200).json({ message: 'Plugin is healthy' });
});

router.get('/plugin/download', (_, res) => {
  const folderPath = path.join(__dirname, '../../../../', 'plugins');
  const archive = archiver('zip', { zlib: { level: 9 } });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=kobuddy.plugin.zip');

  archive.on('error', (err) => {
    console.error('Archive error:', err);
    res.status(500).send('Error creating zip');
  });

  // Pipe the archive directly to the response
  archive.pipe(res);

  // Add folder contents to the archive
  archive.directory(folderPath, false);

  archive.finalize();
});

export { router as pluginRouter };
