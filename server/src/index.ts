import cors from 'cors';
import express, { Request, Response } from 'express';
import path from 'path';
import { koreaderRouter } from './routes/koreader';
import { openLibraryRouter } from './routes/open-library';
import { uploadRouter } from './routes/upload-db';
import { BASE_PATH } from './const';

require('dotenv').config();

const app = express();

const port = Number(process.env.PORT ?? 3001);
const hostname = process.env.HOST || 'localhost';

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  // Allow requests from dev build
  app.use(cors({ origin: '*' }));
}

// Setup controllers
app.use('/api', koreaderRouter);
app.use('/api', uploadRouter);
app.use('/api', openLibraryRouter);

// Serve react app
const buildPath = path.join(BASE_PATH, 'public');
app.use(express.static(buildPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Start :)
const server = app.listen(port, hostname, () => {
  console.info(`KoBuddy back-end is running on http://${hostname}:${port}`);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Gracefully shutting down...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Gracefully shutting down...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
