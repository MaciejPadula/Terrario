export type DayCell = {
  date: Date;
  isCurrentMonth: boolean;
  key: string;
};

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toDayKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addMonths(date: Date, deltaMonths: number) {
  return new Date(date.getFullYear(), date.getMonth() + deltaMonths, 1);
}

export function toLocalDateTimeParam(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
}

// Monday-based week (Mon=0 ... Sun=6)
function getMondayIndex(jsDay: number) {
  return (jsDay + 6) % 7;
}

export function buildMonthGrid(viewMonth: Date): DayCell[] {
  const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const lastOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);

  const leading = getMondayIndex(firstOfMonth.getDay());
  const totalDaysInMonth = lastOfMonth.getDate();

  const cells: DayCell[] = [];

  // Leading days (previous month)
  for (let i = leading; i > 0; i -= 1) {
    const d = new Date(firstOfMonth);
    d.setDate(firstOfMonth.getDate() - i);
    const date = startOfDay(d);
    cells.push({
      date,
      isCurrentMonth: false,
      key: toDayKey(date),
    });
  }

  // Current month days
  for (let day = 1; day <= totalDaysInMonth; day += 1) {
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    const sd = startOfDay(date);
    cells.push({
      date: sd,
      isCurrentMonth: true,
      key: toDayKey(sd),
    });
  }

  // Trailing days to fill 6 rows (42 cells)
  while (cells.length < 42) {
    const last = cells[cells.length - 1]!.date;
    const next = new Date(last);
    next.setDate(last.getDate() + 1);
    const sd = startOfDay(next);
    cells.push({
      date: sd,
      isCurrentMonth: false,
      key: toDayKey(sd),
    });
  }

  return cells;
}

export function getDayNames(locale: string): string[] {
  // Monday-first
  const base = new Date(2026, 0, 5); // Monday
  return Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(base);
    d.setDate(base.getDate() + idx);
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
  });
}

export function getMonthLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}
