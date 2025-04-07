import { IconBook } from '@tabler/icons-react';
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
  return (
    <NavLink to={RoutePath.HOME} onClick={onClick} className={C(style.Logo, className)}>
      <IconBook className={style.LogoIcon} size={24} />
      <strong>KoInsight</strong>
    </NavLink>
  );
}
