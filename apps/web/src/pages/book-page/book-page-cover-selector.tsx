import { Book } from '@kobuddy/common/types/book';
import { Box, Button, Flex, Image, Skeleton, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { JSX, useState } from 'react';
import { listCovers, saveCover } from '../../api/open-library';

import style from './book-page-cover-selector.module.css';

type BookPageCoverSelectorProps = {
  book: Book;
};

export function BookPageCoverSelector({ book }: BookPageCoverSelectorProps): JSX.Element {
  const [state, setState] = useState<{
    data: string[] | null;
    isLoading: boolean;
    loadedCovers: string[];
  }>({ data: null, isLoading: false, loadedCovers: [] });

  const onSearch = async () => {
    setState({ isLoading: true, data: null, loadedCovers: [] });
    const coverIds = await listCovers(book.title);
    setState((prev) => ({ ...prev, isLoading: false, data: coverIds }));
  };

  const onSave = async (coverId: string) =>
    saveCover(book.id, coverId ?? '')
      .then(() =>
        notifications.show({
          title: 'Cover saved',
          message: 'Cover saved successfully.',
          position: 'top-center',
        })
      )
      .catch(() =>
        notifications.show({
          title: 'Error saving cover',
          message: `Unable to save cover for ${book.title}.`,
          color: 'red',
          position: 'top-center',
        })
      );

  return (
    <>
      <Button onClick={onSearch} loading={state.isLoading} color="violet">
        Search Covers
      </Button>
      <Flex mt="lg" gap={16} direction="row" wrap="wrap">
        {state.data?.map((coverId) => (
          <Box
            key={coverId}
            onClick={() => onSave(coverId)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <Skeleton visible={!state.loadedCovers.includes(coverId)} height={250}>
              <Tooltip position="top" label="Click to save cover" withArrow>
                <Image
                  src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
                  h={250}
                  w={180}
                  fit="contain"
                  style={{ width: state.loadedCovers.includes(coverId) ? 'auto' : 150 }}
                  onLoad={() =>
                    setState((prev) => ({ ...prev, loadedCovers: [...prev.loadedCovers, coverId] }))
                  }
                  fallbackSrc="/book-placeholder-small.png"
                  className={style.Cover}
                />
              </Tooltip>
            </Skeleton>
          </Box>
        ))}
      </Flex>
    </>
  );
}
