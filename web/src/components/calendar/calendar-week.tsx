import { addDays } from 'date-fns/addDays';
import { format } from 'date-fns/format';
import { startOfWeek } from 'date-fns/startOfWeek';
import { range } from 'ramda';
import { JSX } from 'react';

import style from './calendar-week.module.css';

export function CalendarWeek({ currentDate }: { currentDate: Date }): JSX.Element {
  const startDate = startOfWeek(currentDate, { locale: { options: { weekStartsOn: 1 } } });
  const days = range(0, 7).map((i) => <div key={i}>{format(addDays(startDate, i), 'EEEEEE')}</div>);

  return <div className={style.CalendarWeek}>{days}</div>;
}
