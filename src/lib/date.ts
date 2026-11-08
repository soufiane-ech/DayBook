const longDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const shortDate = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function formatLongDate(value: string | Date): string {
  return longDate.format(new Date(value));
}

export function formatShortDate(value: string | Date): string {
  return shortDate.format(new Date(value));
}
