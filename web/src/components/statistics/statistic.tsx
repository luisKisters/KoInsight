import { JSX } from 'react';

import style from './statistic.module.css';

export type StatisticProps = {
  label: string;
  value: string | number;
};

export function Statistic({ label, value }: StatisticProps): JSX.Element {
  return (
    <div className={style.statistic}>
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}
