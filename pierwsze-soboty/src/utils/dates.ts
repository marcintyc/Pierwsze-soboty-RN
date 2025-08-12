export function getFirstSaturdayOfMonth(date: Date): Date {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const dayOfWeek = firstOfMonth.getDay(); // 0 Sun, 6 Sat
  // Compute days until first Saturday (6)
  const delta = (6 - dayOfWeek + 7) % 7;
  const firstSaturday = new Date(year, month, 1 + delta, 0, 0, 0, 0);
  return firstSaturday;
}

export function getNextFirstSaturday(from: Date = new Date()): Date {
  const now = new Date(from);
  const firstThisMonth = getFirstSaturdayOfMonth(now);
  // If today is before the first Saturday (strictly), return it.
  // If it's the same day but time has already passed midnight? We consider entire day; countdown to start of Saturday (00:00).
  if (normalizeToStartOfDay(now) <= normalizeToStartOfDay(firstThisMonth) && now.getDate() <= firstThisMonth.getDate()) {
    if (normalizeToStartOfDay(now).getTime() < normalizeToStartOfDay(firstThisMonth).getTime()) {
      return firstThisMonth;
    }
    // If same day (Saturday) but it's already Saturday, next is this day only if time < end of day
    if (isSameCalendarDay(now, firstThisMonth) && now.getHours() < 24) {
      return firstThisMonth;
    }
  }
  // Otherwise next month
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return getFirstSaturdayOfMonth(nextMonth);
}

export function normalizeToStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function getCountdownParts(target: Date, now: Date = new Date()): { days: number; hours: number; minutes: number; seconds: number; totalMs: number } {
  const diff = target.getTime() - now.getTime();
  const totalMs = Math.max(0, diff);
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalMs };
}

export function formatDateHuman(date: Date): string {
  const formatter = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  return formatter.format(date);
}

export function getUpcomingFirstSaturdays(count: number, from: Date = new Date()): Date[] {
  const list: Date[] = [];
  let cursor = new Date(from);
  for (let i = 0; i < count; i += 1) {
    const next = getNextFirstSaturday(cursor);
    list.push(next);
    cursor = new Date(next.getFullYear(), next.getMonth() + 1, 1);
  }
  return list;
}