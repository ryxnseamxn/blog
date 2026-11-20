const pad = (n: number) => String(n).padStart(2, '0');

export function formatGatheringDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Splits an ISO timestamp into local `YYYY-MM-DD` and `HH:MM` strings for text inputs. */
export function toDateTimeInputs(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

/** Parses local `YYYY-MM-DD` and `HH:MM` inputs into an ISO timestamp, or null if invalid. */
export function fromDateTimeInputs(date: string, time: string): string | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!dateMatch || !timeMatch) return null;

  const [, year, month, day] = dateMatch.map(Number);
  const [, hours, minutes] = timeMatch.map(Number);
  const result = new Date(year, month - 1, day, hours, minutes);
  return result.getMonth() === month - 1 && hours < 24 && minutes < 60 ? result.toISOString() : null;
}
