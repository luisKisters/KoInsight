require('dotenv').config();

import cors from 'cors';
import express, { Request, Response } from 'express';
import { Server } from 'http';
import morgan from 'morgan';
import path from 'path';

import { BASE_PATH, WEB_BUILD_PATH } from './const';
import { booksRouter } from './routes/books-router';
import { kosyncRouter } from './routes/kosync-router';
import { openLibraryRouter } from './routes/open-library-router';
import { statsRouter } from './routes/stats-router';
import { uploadRouter } from './routes/upload-router';
import { openAiRouter } from './routes/open-ai-router';
import knex from './knex';

const HOSTNAME = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT ?? 3000);
const ENV = process.env.NODE_ENV;

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
  app.use('/api', openAiRouter);

  // Serve react app
  app.use(express.static(WEB_BUILD_PATH));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(WEB_BUILD_PATH, 'index.html'));
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

async function main() {
  console.log('Running database migrations');
  await knex.migrate.latest({ directory: path.join(__dirname, 'migrations') });
  console.log('Database migrated successfully');

  setupServer().then((server) => {
    process.on('SIGINT', (signal) => stopServer(signal, server));
    process.on('SIGTERM', (signal) => stopServer(signal, server));
  });
}

main();
