import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { formatDuration } from 'date-fns/formatDuration';
import { intervalToDuration } from 'date-fns/intervalToDuration';

export function formatSecondsToHumanReadable(seconds: number, hideSeconds = true): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  if (!hideSeconds) {
    return formatDuration(duration);
  }

  if (!duration.seconds) {
    return '-';
  }

  if (!duration.minutes || duration.minutes === 0) {
    return 'Less than a minute';
  }

  return formatDuration(duration, { format: ['hours', 'minutes'] });
}

export function formatRelativeDate(date: number): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
