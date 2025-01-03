import { addDays } from 'date-fns/addDays';
import { addMonths } from 'date-fns/addMonths';
import { endOfMonth } from 'date-fns/endOfMonth';
import { endOfWeek } from 'date-fns/endOfWeek';
import { format } from 'date-fns/format';
import { isSameMonth } from 'date-fns/isSameMonth';
import { isToday } from 'date-fns/isToday';
import { startOfMonth } from 'date-fns/startOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { subMonths } from 'date-fns/subMonths';
import { JSX, ReactNode, useEffect, useState } from 'react';

import { Button, Flex } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import clsx from 'clsx';
import { CalendarWeek } from './calendar-week';

import style from './calendar.module.css';

export type CalendarEvent<T> = {
  date: Date;
  title?: string;
  data?: T;
};

export type CalendarProps<T> = {
  events: Record<string, CalendarEvent<T>>;
  dayRenderer?: (data: T) => ReactNode;
};

export function Calendar<T>({ events, dayRenderer }: CalendarProps<T>): JSX.Element {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const dates = [];

  let day = startDate;
  while (day <= endDate) {
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isCurrentDay = isToday(day);

    dates.push(
      <div
        className={clsx(
          style.CalendarDate,
          !isCurrentMonth && style.CalendarDateDisabled,
          isCurrentDay && style.CalendarDateToday
        )}
        key={day.toISOString()}
      >
        {events[day.toISOString()] ? <strong>{format(day, 'd')}</strong> : format(day, 'd')}
        <br />
        {events[day.toISOString()] && (
          <>
            <div className={style.CalendarEvent}>
              {events[day.toISOString()].title}
              {events[day.toISOString()]?.data && dayRenderer?.(events[day.toISOString()].data!)}
            </div>
          </>
        )}
      </div>
    );
    day = addDays(day, 1);
  }

  function bindShortcuts(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', bindShortcuts);
    return () => {
      window.removeEventListener('keydown', bindShortcuts);
    };
  });

  return (
    <div className={style.Calendar}>
      <div className={style.CalendarHeader}>
        <Button
          size="xs"
          variant="outline"
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        >
          <IconArrowLeft size={16} />
        </Button>
        <Flex gap={8}>
          <Button size="xs" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <MonthPickerInput size="xs" value={currentDate} onChange={(e) => setCurrentDate(e!)} />
        </Flex>
        <Button
          size="xs"
          variant="outline"
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
        >
          <IconArrowRight size={16} />
        </Button>
      </div>
      <CalendarWeek currentDate={currentDate} />
      <div className={style.CalendarGrid}>{dates}</div>
    </div>
  );
}
