import useSWR from 'swr';
import { Progress } from '@/common/types/progress';

export function useProgresses() {
  return useSWR('progresses', () =>
    fetch(`http://localhost:3200/syncs/progress`).then((res) => res.json() as Promise<Progress[]>)
  );
}
