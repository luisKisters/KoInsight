import { ProgressWithUsername } from '@kobuddy/common/types/progress';
import { Card, Code, Flex, Progress, Text, Title, Tooltip } from '@mantine/core';
import {
  IconAlertTriangle,
  IconDeviceTablet,
  IconNote,
  IconPercentage,
  IconProgress,
  IconUser,
} from '@tabler/icons-react';
import { groupBy } from 'ramda';
import { useProgresses } from '../api/kosync';
import { useBooks } from '../api/use-books';

export function SyncsPage() {
  const { data: progresses, isLoading } = useProgresses();
  const { data: books } = useBooks();

  const byDevice = groupBy((progress: ProgressWithUsername) => progress.device_id)(
    progresses || []
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title mb="sm">Progress Syncs</Title>
      <Flex mb="xl" gap="xs" align="center">
        <IconAlertTriangle color="var(--mantine-color-orange-5)" />
        <Text>
          Progress syncs are detached from the rest of the Kobuddy database for now.
          <br />
          This page gives a summary of what data is available in the syncs database.
        </Text>
      </Flex>
      {Object.entries(byDevice).map(([deviceId, progresses]) => (
        <div key={deviceId}>
          <Tooltip position="top-start" withArrow label={`Device ID: ${progresses?.[0].device_id}`}>
            <Title order={3} mb="sm" mt="xl">
              <Flex align="center" gap={4}>
                <IconDeviceTablet /> {progresses?.[0].device}
              </Flex>
            </Title>
          </Tooltip>

          <Flex gap="sm" wrap="wrap">
            {progresses?.map((progress) => (
              <Card padding="lg" radius="md" withBorder>
                <Flex direction="column" key={progress.id} gap="xs">
                  <Flex gap="xs" align="center">
                    <Tooltip withArrow label="Username">
                      <IconUser size={18} />
                    </Tooltip>
                    <strong>{progress.username}</strong>
                  </Flex>
                  <Flex gap="xs" align="center">
                    <Tooltip withArrow label="Document">
                      <IconNote size={18} />
                    </Tooltip>
                    <Code>
                      {progress.document} {books?.find((b) => b.md5 === progress.document)?.title}
                    </Code>
                  </Flex>
                  <Flex gap="xs" align="center">
                    <Tooltip withArrow label="Progress">
                      <IconProgress size={18} />
                    </Tooltip>
                    <Code>{progress.progress}</Code>
                  </Flex>
                  <Flex gap="xs" align="center">
                    <Tooltip withArrow label="Percentage">
                      <IconPercentage size={18} />
                    </Tooltip>
                    <Progress w="100" value={progress.percentage * 100} />{' '}
                    {progress.percentage * 100}%
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        </div>
      ))}
    </div>
  );
}
