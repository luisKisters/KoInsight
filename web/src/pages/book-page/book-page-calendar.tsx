import { Anchor } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { startOfDay } from 'date-fns/startOfDay';
import { sum } from 'ramda';
import { JSX } from 'react';
import { Link } from 'react-router';
import { BookWithStats } from '../../api/use-book-with-stats';
import { PageStat } from '../../api/use-page-stats';
import { Calendar, CalendarEvent } from '../../components/calendar/calendar';
import { getBookPath } from '../../routes';
import { formatSecondsToHumanReadable } from '../../utils/dates';

type BookPageCalendarProps = {
  book: BookWithStats;
};

type DayData = {
  events: PageStat[];
};

export function BookPageCalendar({ book }: BookPageCalendarProps): JSX.Element {
  const calendarEvents = book.stats.reduce<Record<string, CalendarEvent<DayData>>>((acc, event) => {
    const date = startOfDay(event.start_time * 1000);
    const key = date.toISOString();
    acc[key] = acc[key] || { date, data: { events: [] } };
    acc[key].data = acc[key]?.data?.events
      ? { events: [...acc[key].data.events, event] }
      : { events: [event] };

    return acc;
  }, {});

  return (
    <Calendar<DayData>
      events={calendarEvents}
      dayRenderer={(data) => (
        <>
          <Anchor key={book.id} component={Link} to={getBookPath(book.id)}>
            {book.title}
          </Anchor>
          <br />
          <IconClock size={14} />{' '}
          {formatSecondsToHumanReadable(sum(data.events.map((event) => event.duration)))}
        </>
      )}
    />
  );
}
