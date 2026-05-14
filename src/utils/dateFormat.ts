type DateValue = Date | string | number;

const DEFAULT_LOCALE = 'en-US';

function toDate(value: DateValue): Date {
  return value instanceof Date ? value : new Date(value);
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

export function formatShortDate(value: DateValue): string {
  const date = toDate(value);
  if (!isValidDate(date)) {
    return '';
  }

  return date.toLocaleDateString(DEFAULT_LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatLongDate(value: DateValue): string {
  const date = toDate(value);
  if (!isValidDate(date)) {
    return '';
  }

  return date.toLocaleDateString(DEFAULT_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortTime(value: DateValue): string {
  const date = toDate(value);
  if (!isValidDate(date)) {
    return '';
  }

  return date.toLocaleTimeString(DEFAULT_LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatShortDateTime(value: DateValue): string {
  const date = toDate(value);
  if (!isValidDate(date)) {
    return '';
  }

  return date.toLocaleString(DEFAULT_LOCALE, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function isSameCalendarDate(
  firstValue: DateValue,
  secondValue: DateValue
): boolean {
  const firstDate = toDate(firstValue);
  const secondDate = toDate(secondValue);

  if (!isValidDate(firstDate) || !isValidDate(secondDate)) {
    return false;
  }

  return (
    firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear()
  );
}

export function isToday(value: DateValue, now = new Date()): boolean {
  return isSameCalendarDate(value, now);
}

export function isTomorrow(value: DateValue, now = new Date()): boolean {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameCalendarDate(value, tomorrow);
}
