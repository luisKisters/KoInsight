import { Flex, NumberInput, Slider } from '@mantine/core';
import { IconCalendar, IconClock, IconNote } from '@tabler/icons-react';
import { formatDate } from 'date-fns';
import { JSX, useState } from 'react';
import { BookWithStats } from '../../api/use-book-with-stats';
import { formatSecondsToHumanReadable } from '../../utils/dates';
import { sum } from 'ramda';

type BookPageSelectorProps = {
  book: BookWithStats;
};

export function BookPageSelector({ book }: BookPageSelectorProps): JSX.Element {
  const [showPage, setShowPage] = useState(() => book?.stats[0].page ?? 1);

  const pageStats = book?.stats.filter((stat) => stat.page === showPage);
  const maxPage = book?.pages;

  return (
    <>
      <Flex gap={10} w="100%" align="center">
        <NumberInput
          size="xs"
          w="70"
          value={showPage}
          onChange={(e) => setShowPage(Number(e))}
          min={1}
          max={maxPage}
        />
        <Slider
          style={{ flexGrow: 1 }}
          value={showPage}
          min={1}
          max={maxPage}
          onChange={setShowPage}
        />
      </Flex>
      <br />
      <IconNote size={14} />
      &nbsp;
      {showPage} of {maxPage}
      <br />
      {pageStats.length > 0 ? (
        <>
          <div>
            <IconCalendar size={14} />{' '}
            {formatDate(pageStats[0].start_time * 1000, 'dd LLL yyyy, HH:mm:ss')}
          </div>
          <div>
            <IconClock size={14} />
            &nbsp;
            {formatSecondsToHumanReadable(
              sum(pageStats.map((pageStat) => pageStat.duration)),
              false
            )}
          </div>
        </>
      ) : (
        <>
          <IconCalendar size={14} /> No page read data
        </>
      )}
    </>
  );
}
