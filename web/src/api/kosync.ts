import { ProgressWithUsername } from '@/common/types/progress';
import useSWR from 'swr';
import { SERVER_URL } from './api';

export function useProgresses() {
  return useSWR('progresses', () =>
    fetch(`${SERVER_URL}/syncs/progress`).then(
      (res) => res.json() as Promise<ProgressWithUsername[]>
    )
  );
}
