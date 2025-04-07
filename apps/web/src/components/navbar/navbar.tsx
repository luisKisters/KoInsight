import {
  ActionIcon,
  Box,
  Button,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconBooks,
  IconCalendar,
  IconChartBar,
  IconMoon,
  IconReload,
  IconSun,
} from '@tabler/icons-react';
import { JSX, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { RoutePath } from '../../routes';
import { UploadForm } from '../header/upload-form';
import { Logo } from '../logo/logo';

import style from './navbar.module.css';

const tabs = [
  { link: RoutePath.BOOKS, label: 'Books', icon: IconBooks },
  { link: RoutePath.CALENDAR, label: 'Calendar', icon: IconCalendar },
  { link: RoutePath.STATS, label: 'Stats', icon: IconChartBar },
  { link: RoutePath.SYNCS, label: 'Progress Syncs', icon: IconReload },
];

export function Navbar({ onNavigate }: { onNavigate?: () => void }): JSX.Element {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme();
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const { pathname } = useLocation();
  const [active, setActive] = useState(
    () => tabs.find((item) => item.link === pathname)?.link ?? RoutePath.HOME
  );

  const onClick = (link: RoutePath) => {
    setActive(link);
    onNavigate?.();
  };

  const links = tabs.map((item) => (
    <NavLink
      className={style.Link}
      data-active={item.link === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => onClick(item.link)}
    >
      <item.icon className={style.LinkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <Box className={style.Navbar} component="nav">
      <Logo
        onClick={() => {
          setActive(RoutePath.HOME);
          onNavigate?.();
        }}
        className={style.Logo}
      />
      <div>{links}</div>
      <div className={style.Footer}>
        <Button component="a" href="/api/plugin/download" variant="subtle">
          Download Plugin
        </Button>
        <UploadForm />
        <ActionIcon
          onClick={toggleColorScheme}
          variant="default"
          size="lg"
          aria-label="Toggle color scheme"
        >
          {computedColorScheme === 'dark' ? (
            <IconSun stroke={1.5} color="yellow" />
          ) : (
            <IconMoon stroke={1.5} color="violet" />
          )}
        </ActionIcon>
      </div>
    </Box>
  );
}
