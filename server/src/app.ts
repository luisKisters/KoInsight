import cors from 'cors';
import express, { Request, Response } from 'express';
import { Server } from 'http';
import morgan from 'morgan';
import path from 'path';
import { BASE_PATH } from './const';
import { booksRouter } from './routes/books-router';
import { kosyncRouter } from './routes/kosync-router';
import { openLibraryRouter } from './routes/open-library-router';
import { statsRouter } from './routes/stats-router';
import { uploadRouter } from './routes/upload-router';

require('dotenv').config();

const HOSTNAME = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT ?? 3001);
const ENV = process.env.NODE_ENV;

const BUILD_PATH = path.join(BASE_PATH, '/dist/public');

async function setupServer() {
  const app = express();
  app.use(express.json());
  app.use(morgan('tiny'));

  if (ENV === 'development') {
    // Allow requests from dev build
    app.use(cors({ origin: '*' }));
  }

  // Setup controllers
  app.use('/', kosyncRouter);
  app.use('/api', booksRouter);
  app.use('/api', statsRouter);
  app.use('/api', uploadRouter);
  app.use('/api', openLibraryRouter);

  // Serve react app
  app.use(express.static(BUILD_PATH));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(BUILD_PATH, 'index.html'));
  });

  // Start :)
  const server = app.listen(PORT, HOSTNAME, () => {
    console.info(`KoBuddy back-end is running on http://${HOSTNAME}:${PORT}`);
  });

  return server;
}

function stopServer(signal: NodeJS.Signals, server: Server) {
  console.log(`Received ${signal.toString()}. Gracefully shutting down...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
}

setupServer().then((server) => {
  process.on('SIGINT', (signal) => stopServer(signal, server));
  process.on('SIGTERM', (signal) => stopServer(signal, server));
});
