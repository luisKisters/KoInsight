import { IconBook } from '@tabler/icons-react';
import C from 'clsx';
import { JSX } from 'react';
import { NavLink } from 'react-router';
import { RoutePath } from '../../routes';

import style from './logo.module.css';
import { useComputedColorScheme } from '@mantine/core';

export type LogoProps = {
  className?: string;
  onClick?: () => void;
};

export function Logo({ onClick, className }: LogoProps): JSX.Element {
  const colorScheme = useComputedColorScheme();
  return (
    <NavLink to={RoutePath.HOME} onClick={onClick} className={C(style.Logo, className)}>
      <img
        src={colorScheme === 'light' ? '/src/assets/logo.png' : '/src/assets/logo-dark.png'}
        alt="KoInsight"
        height="50px"
        className={style.LogoImage}
      />
      <strong>KoInsight</strong>
    </NavLink>
  );
}
