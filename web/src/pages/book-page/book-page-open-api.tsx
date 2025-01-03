import { Anchor, Button, Flex, Table, Text, Image, Tooltip, Box } from '@mantine/core';
import { modals } from '@mantine/modals';
import { JSX, ReactElement, useState } from 'react';
import { queryBook, SearchData } from '../../api/open-library';
import { BookWithStats } from '../../api/use-book-with-stats';
import { fetchFromAPI } from '../../api/api';
import { IconDownload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

type BookPageOpenApiProps = {
  book: BookWithStats;
};

export function BookPageOpenApi({ book }: BookPageOpenApiProps): JSX.Element {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(false);

  const saveCover = async (coverId: string) => {
    fetchFromAPI(`cover?coverId=${coverId}&bookId=${book.id}`, 'GET').then(() => {
      notifications.show({
        title: 'Cover saved',
        message: 'Cover saved successfully.',
        position: 'top-center',
      });
    });
  };

  const saveCoverByIsbn = async (isbn: string) => {
    fetchFromAPI(`cover?isbn=${isbn}&bookId=${book.id}`, 'GET').then(() => {
      notifications.show({
        title: 'Cover saved',
        message: 'Cover saved successfully.',
        position: 'top-center',
      });
    });
  };

  const openDetailsModal = (title: string, text: ReactElement) =>
    modals.open({
      centered: true,
      title,
      children: <Text size="sm">{text}</Text>,
    });

  const lookupBook = async () => {
    if (!book) {
      return;
    }

    setLoading(true);

    const data = await queryBook(book.title);
    setSearchData(data);
    if (!data || data.numFound === 0) {
      notifications.show({
        title: 'No results found',
        message: 'No results found for this book.',
        color: 'orange',
        position: 'top-center',
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        gap={4}
        bg="gray.1"
        bd="1px solid gray.4"
        style={{ borderRadius: '4px' }}
        py="sm"
        px="md"
      >
        <div>Query OpenLibrary API for book details (this takes a while)</div>
        <Button loading={loading} onClick={lookupBook}>
          Fetch
        </Button>
      </Flex>
      {searchData && searchData.numFound > 0 && (
        <Table w="100%">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Cover</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Author</Table.Th>
              <Table.Th>Language</Table.Th>
              <Table.Th>ISBN</Table.Th>
              <Table.Th>Number of Pages</Table.Th>
              <Table.Th>Goodreads ID</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {searchData.docs.map((doc) => (
              <Table.Tr key={doc.key}>
                <Table.Td>
                  {doc.cover_i && (
                    <Flex direction="column" gap={4}>
                      <Image
                        src={`https://covers.openlibrary.org/b/id/${doc.cover_i}.jpg`}
                        alt={String(doc.cover_i!)}
                        h="150px"
                      />
                      <Tooltip label="Save cover" position="top">
                        <Button size="xs" onClick={() => saveCover(doc.cover_i!.toString())}>
                          <IconDownload size={16} />
                        </Button>
                      </Tooltip>
                    </Flex>
                  )}
                </Table.Td>
                <Table.Td>{doc.title}</Table.Td>
                <Table.Td>{doc.author_name}</Table.Td>
                <Table.Td>{doc.language?.join(', ')}</Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() =>
                      openDetailsModal(
                        'ISBNs',
                        <ul>
                          {doc.isbn?.map((isbn) => (
                            <li key={isbn}>{isbn}</li>
                          ))}
                        </ul>
                      )
                    }
                  >
                    isbns ({doc.isbn?.length})
                  </Button>
                </Table.Td>

                <Table.Td>{doc.number_of_pages_median}</Table.Td>

                <Table.Td>
                  <Flex gap={4}>
                    {doc.id_goodreads?.slice(0, 3).map((id) => (
                      <Anchor
                        key={id}
                        href={`https://goodreads.com/book/show/${id}`}
                        target="_blank"
                      >
                        {id}
                      </Anchor>
                    ))}
                    {(doc.id_goodreads ?? []).length > 3 && (
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() =>
                          openDetailsModal(
                            'Goodreads',
                            <Flex direction="column">
                              {doc.id_goodreads!.map((id) => (
                                <Anchor
                                  key={id}
                                  href={`https://goodreads.com/book/show/${id}`}
                                  target="_blank"
                                >
                                  {id}
                                </Anchor>
                              ))}
                            </Flex>
                          )
                        }
                      >
                        {doc.id_goodreads!.length - 3} more
                      </Button>
                    )}
                  </Flex>
                </Table.Td>
                <Table.Td>
                  <Flex gap={4}>
                    <Button
                      size="xs"
                      onClick={() =>
                        modals.open({
                          title: 'Choose cover',
                          children: (
                            <Flex gap={16} direction="column">
                              {doc.isbn.map((isbn) => (
                                <Flex key={isbn} direction="column" gap={4}>
                                  <Image
                                    src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`}
                                    alt={isbn}
                                    h="150px"
                                  />
                                  <Button
                                    leftSection={<IconDownload size={16} stroke={1.5} />}
                                    size="xs"
                                    onClick={() => saveCoverByIsbn(isbn)}
                                  >
                                    Save
                                  </Button>
                                </Flex>
                              ))}
                            </Flex>
                          ),
                        })
                      }
                    >
                      Pick cover
                    </Button>
                    <Button
                      size="xs"
                      onClick={() =>
                        modals.open({
                          centered: true,
                          title: 'Raw',
                          size: 'xl',
                          children: <pre>{JSON.stringify(doc, null, 2)}</pre>,
                        })
                      }
                    >
                      Raw
                    </Button>
                  </Flex>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
}
