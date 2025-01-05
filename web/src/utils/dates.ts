import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { formatDuration } from 'date-fns/formatDuration';
import { intervalToDuration } from 'date-fns/intervalToDuration';

export function formatSecondsToHumanReadable(seconds: number, hideSeconds = true): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  if (!hideSeconds) {
    return formatDuration(duration);
  }

  if (!duration.minutes && !duration.hours && !duration.seconds) {
    return 'N/A';
  }

  if (!duration.minutes && !duration.hours && duration.seconds && duration.seconds > 0) {
    return 'Less than a minute';
  }

  return formatDuration(duration, { format: ['hours', 'minutes'] });
}

export function formatRelativeDate(date: number): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
