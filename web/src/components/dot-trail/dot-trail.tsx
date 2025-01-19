import { darken, rgba, Tooltip } from '@mantine/core';
import { startOfDay, startOfMonth, subMonths } from 'date-fns';
import { JSX, ReactNode, useMemo } from 'react';

import style from './dot-trail.module.css';

export type DayData = {
  percent: number;
  tooltip: ReactNode;
};

type DotTrailProps = {
  percentPerDay: Record<number, DayData>;
};

export function DotTrail({ percentPerDay }: DotTrailProps): JSX.Element {
  const today = startOfDay(new Date());
  const start = startOfMonth(subMonths(today, 12));
  const end = today;

  const allDays = useMemo(() => {
    const days = [];
    let current = start;
    while (current <= end) {
      days.push(current.getTime());
      current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    }

    return days;
  }, [start, end]);

  return (
    <div className={style.dotGrid}>
      {allDays.map((day) => (
        <div key={day}>
          <Tooltip
            withArrow
            label={percentPerDay[day] ? percentPerDay[day].tooltip : 'No data for this day'}
          >
            <div
              key={day}
              className={style.dot}
              style={{
                outlineColor: percentPerDay[day]
                  ? darken(`rgb(35, 139, 230, ${percentPerDay[day].percent / 100})`, 0.4)
                  : 'rgba(0, 0, 0, 0.05)',
                backgroundColor: percentPerDay[day]
                  ? `rgb(35, 139, 230, ${percentPerDay[day].percent / 100})`
                  : 'rgba(255, 255, 255)',
              }}
            />
          </Tooltip>
        </div>
      ))}
    </div>
  );
}
