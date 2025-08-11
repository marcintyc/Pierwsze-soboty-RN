import { startOfYear, endOfYear, eachMonthOfInterval, getDay, addDays, format } from 'date-fns';

export function getFirstSaturdaysOfYear(year: number): string[] {
  const months = eachMonthOfInterval({ start: startOfYear(new Date(year, 0, 1)), end: endOfYear(new Date(year, 11, 31)) });
  const saturdays: string[] = [];
  for (const month of months) {
    const dayOfWeek = getDay(new Date(month.getFullYear(), month.getMonth(), 1));
    const offset = (6 - dayOfWeek + 7) % 7; // Saturday index is 6
    const firstSaturday = addDays(new Date(month.getFullYear(), month.getMonth(), 1), offset);
    saturdays.push(format(firstSaturday, 'yyyy-MM-dd'));
  }
  return saturdays;
}

export function getFirstSaturdayOfCurrentMonth(): string {
  const now = new Date();
  const dayOfWeek = getDay(new Date(now.getFullYear(), now.getMonth(), 1));
  const offset = (6 - dayOfWeek + 7) % 7;
  const firstSaturday = addDays(new Date(now.getFullYear(), now.getMonth(), 1), offset);
  return format(firstSaturday, 'yyyy-MM-dd');
}