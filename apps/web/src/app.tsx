import { Box, Burger, createTheme, Drawer, Group, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Navbar } from './components/navbar/navbar';
import { BookPage } from './pages/book-page/book-page';
import { BooksPage } from './pages/books-page/books-page';
import { CalendarPage } from './pages/calendar-page';
import { StatsPage } from './pages/stats-page';
import { SyncsPage } from './pages/syncs-page';
import { RoutePath } from './routes';

import style from './app.module.css';
import { Logo } from './components/logo/logo';
import { useDisclosure } from '@mantine/hooks';

const theme = createTheme({
  fontFamily: 'Noto Serif, serif',
  primaryColor: 'kobuddy',
  primaryShade: 8,
  colors: {
    kobuddy: [
      '#e2fefc',
      '#d3f8f5',
      '#acede8',
      '#81e3dc',
      '#5edad1',
      '#46d5ca',
      '#36d2c7',
      '#23baaf',
      '#0aa69c',
      '#009087',
    ],
  },
});

export function App(): JSX.Element {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <div className={style.App}>
          <Group hiddenFrom="sm" align="center" gap="sm" mb="lg" ml="md">
            <Burger size="sm" onClick={() => openDrawer()} />
            <Logo onClick={() => {}} />
          </Group>
          <Drawer opened={drawerOpened} onClose={closeDrawer}>
            <Navbar onNavigate={closeDrawer} />
          </Drawer>
          <Box visibleFrom="sm">
            <Navbar />
          </Box>
          <main className={style.Main}>
            <Routes>
              <Route index element={<Navigate to={RoutePath.BOOKS} />} />
              <Route path={RoutePath.BOOKS} element={<BooksPage />} />
              <Route path={RoutePath.BOOK} element={<BookPage />} />
              <Route path={RoutePath.CALENDAR} element={<CalendarPage />} />
              <Route path={RoutePath.STATS} element={<StatsPage />} />
              <Route path={RoutePath.SYNCS} element={<SyncsPage />} />
            </Routes>
          </main>
        </div>
      </ModalsProvider>
    </MantineProvider>
  );
}
