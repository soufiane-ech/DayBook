/** Calendar days are stored as local 'YYYY-MM-DD' keys, which also sort chronologically. */
export function toDateKey(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Not new Date(key), which reads the key as UTC and can land on the previous day. */
function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(key: string, days: number): string {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

const dayAndMonth = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

const dayMonthAndYear = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** A short date, with the year only when it isn't the same as the reference day's. */
export function formatShortDate(key: string, referenceKey: string): string {
  const format = key.slice(0, 4) === referenceKey.slice(0, 4) ? dayAndMonth : dayMonthAndYear;
  return format.format(parseDateKey(key));
}

const longDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const fullDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const monthAndYear = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

const shortWeekday = new Intl.DateTimeFormat(undefined, { weekday: 'short' });

export function formatLongDate(value: Date): string {
  return longDate.format(value);
}

export function formatFullDate(key: string): string {
  return fullDate.format(parseDateKey(key));
}

export function formatMonthAndYear(key: string): string {
  return monthAndYear.format(parseDateKey(key));
}

export function formatShortWeekday(key: string): string {
  return shortWeekday.format(parseDateKey(key));
}
