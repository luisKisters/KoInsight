import { Anchor, Avatar, Box, Flex } from '@mantine/core';
import {
  IconBook,
  IconBook2,
  IconBooks,
  IconCalendar,
  IconChartBar,
  IconReload,
} from '@tabler/icons-react';
import { useState } from 'react';

import { NavLink, useLocation } from 'react-router';
import { RoutePath } from '../../routes';
import { UploadForm } from '../header/upload-form';

import style from './navbar.module.css';

const tabs = [
  { link: RoutePath.BOOKS, label: 'Books', icon: IconBooks },
  { link: RoutePath.CALENDAR, label: 'Calendar', icon: IconCalendar },
  { link: RoutePath.STATS, label: 'Stats', icon: IconChartBar },
  { link: RoutePath.SYNCS, label: 'Progress Syncs', icon: IconReload },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(
    () => tabs.find((item) => item.link === pathname)?.link ?? RoutePath.HOME
  );

  const links = tabs.map((item) => (
    <NavLink
      className={style.Link}
      data-active={item.link === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => setActive(item.link)}
    >
      <item.icon className={style.LinkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <nav className={style.Navbar}>
      <NavLink to={RoutePath.HOME} onClick={() => setActive(RoutePath.HOME)} className={style.Logo}>
        <IconBook className={style.LogoIcon} size={24} />
        <strong>KoBuddy</strong>
      </NavLink>
      <div>{links}</div>
      <div className={style.Footer}>
        {/* <Flex gap="sm" align="center">
          <Avatar name="User 1" color="initials" ml="sm" radius="lg" />
          <strong>User 1</strong>
        </Flex> */}
        <UploadForm />
      </div>
    </nav>
  );
}
