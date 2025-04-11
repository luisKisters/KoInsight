import {
  Card,
  Flex,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconProgressX } from '@tabler/icons-react';

export type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  const theme = useComputedColorScheme();
  const { colors } = useMantineTheme();

  return (
    <Card padding="xl" radius="md" bg="transparent">
      <Flex gap="md" align="center">
        <IconProgressX size={90} color={theme === 'dark' ? colors.gray[7] : colors.gray[4]} />
        <Stack gap={0}>
          <Title order={4}>{title}</Title>
          {description && <Text c="dimmed">{description}</Text>}
        </Stack>
      </Flex>
    </Card>
  );
}
