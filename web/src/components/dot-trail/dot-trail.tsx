import { darken, rgba, Tooltip } from '@mantine/core';
import { startOfDay, startOfMonth, startOfWeek, subDays, subMonths } from 'date-fns';
import { JSX, ReactNode, useMemo, useRef } from 'react';

import style from './dot-trail.module.css';
import { useElementSize, useViewportSize } from '@mantine/hooks';

export type DayData = {
  percent: number;
  tooltip: ReactNode;
};

type DotTrailProps = {
  percentPerDay: Record<number, DayData>;
};

export function DotTrail({ percentPerDay }: DotTrailProps): JSX.Element {
  const { width } = useViewportSize();

  // TODO: find a better way to compute this
  const dotsToFit = Math.floor((width - 500) / 18);
  const daysToFit = dotsToFit * 7;

  const today = startOfDay(new Date());

  const start = startOfDay(
    startOfWeek(subDays(today, daysToFit), {
      locale: { options: { weekStartsOn: 1 } },
    })
  );

  const allDays = useMemo(() => {
    const days = [];
    let current = start;
    while (current <= today) {
      days.push(startOfDay(current.getTime()).valueOf());
      current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    }

    return days;
  }, [start, today]);

  return (
    <div className={style.dotGrid} style={{ width: `${width}px` }}>
      {allDays.map((day) => (
        <div key={day}>
          <Tooltip
            withArrow
            label={
              percentPerDay[day]
                ? percentPerDay[day].tooltip
                : `No data for ${new Date(day).toDateString()}`
            }
          >
            <div
              key={day}
              className={style.dot}
              style={{
                outlineColor: percentPerDay[day]
                  ? darken(`rgba(35, 186, 175, ${percentPerDay[day].percent / 100})`, 0.4)
                  : 'rgba(0, 0, 0, 0.05)',
                backgroundColor: percentPerDay[day]
                  ? `rgba(35, 186, 175, ${percentPerDay[day].percent / 100})`
                  : 'rgba(255, 255, 255)',
              }}
            />
          </Tooltip>
        </div>
      ))}
    </div>
  );
}
