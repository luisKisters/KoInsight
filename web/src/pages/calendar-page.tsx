import { Book } from '@/common/types/book';
import { Anchor, Flex, Loader } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { startOfDay } from 'date-fns/startOfDay';
import { sum, uniq } from 'ramda';
import { JSX, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { useBooks } from '../api/use-books';
import { PageStat, usePageStats } from '../api/use-page-stats';
import { Calendar, CalendarEvent } from '../components/calendar/calendar';
import { getBookPath } from '../routes';
import { formatSecondsToHumanReadable } from '../utils/dates';

type DayData = {
  events: PageStat[];
};

export function CalendarPage(): JSX.Element {
  const { data: books, isLoading } = useBooks();
  const { data: events, isLoading: eventsLoading } = usePageStats();

  const calendarEvents = useMemo<Record<string, CalendarEvent<DayData>>>(() => {
    if (eventsLoading || !events) {
      return {};
    }

    const eventsList = events.reduce<Record<string, CalendarEvent<DayData>>>((acc, event) => {
      const date = startOfDay(event.start_time * 1000);
      const key = date.toISOString();

      acc[key] = {
        date,
        data: acc[key]?.data?.events
          ? { events: [...acc[key].data.events, event] }
          : { events: [event] },
      };

      return acc;
    }, {});

    return eventsList;
  }, [events, eventsLoading]);

  const getBookById = useCallback((id: number) => books?.find((book) => book.id === id), [books]);

  const getBookNames = useCallback(
    (data: DayData) => {
      const uniqueBookIds = uniq(data.events.map(({ book_id }) => book_id));
      const eventBooks = uniqueBookIds.map((id) => getBookById(id)).filter(Boolean) as Book[];

      return eventBooks.map((book) => (
        <>
          <Anchor key={book.id} component={Link} to={getBookPath(book.id)}>
            {book.title}
          </Anchor>
          <br />
          <IconClock size={14} />{' '}
          {formatSecondsToHumanReadable(
            sum(
              data.events
                .filter((event) => event.book_id === book.id)
                .map((event) => event.duration)
            )
          )}
          <br />
          -
          <br />
        </>
      ));
    },
    [getBookById]
  );

  if (isLoading || !books || !events || eventsLoading) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Loader />
      </Flex>
    );
  }

  return (
    <Calendar<DayData>
      events={calendarEvents}
      dayRenderer={(data) => getBookNames(data).map((el) => <div>{el}</div>)}
    />
  );
}
