import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { JSX } from 'react';
import { Route, Routes } from 'react-router';
import { Header } from './components/header/header';
import { BookPage } from './pages/book-page/book-page';
import { BooksPage } from './pages/books-page/books-page';
import { CalendarPage } from './pages/calendar-page';
import { RoutePath } from './routes';

import style from './app.module.css';

const theme = createTheme({});

export function App(): JSX.Element {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <Header />
        <main className={style.Main}>
          <Routes>
            <Route path={RoutePath.BOOKS} element={<BooksPage />} />
            <Route path={RoutePath.BOOK} element={<BookPage />} />
            <Route path={RoutePath.CALENDAR} element={<CalendarPage />} />
          </Routes>
        </main>
      </ModalsProvider>
    </MantineProvider>
  );
}
