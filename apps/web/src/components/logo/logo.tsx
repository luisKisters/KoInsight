import { Image, useComputedColorScheme } from '@mantine/core';
import C from 'clsx';
import { JSX } from 'react';
import { NavLink } from 'react-router';
import { RoutePath } from '../../routes';

import style from './logo.module.css';

export type LogoProps = {
  className?: string;
  onClick?: () => void;
};

export function Logo({ onClick, className }: LogoProps): JSX.Element {
  const colorScheme = useComputedColorScheme();
  return (
    <NavLink to={RoutePath.HOME} onClick={onClick} className={C(style.Logo, className)}>
      <Image
        src={colorScheme === 'light' ? '/logo.png' : '/logo-dark.png'}
        alt="KoInsight"
        height="50px"
        className={style.LogoImage}
      />
      <strong>KoInsight</strong>
    </NavLink>
  );
}
