import {
  addDays,
  addMonths,
  addWeeks,
  format,
  getDaysInMonth,
  getISODay,
  parseISO,
  startOfDay,
} from 'date-fns';
import { Periodicity } from './models/recurring-expense.model';

const DATE_FORMAT = 'yyyy-MM-dd';

export const WEEKDAYS: readonly string[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

function monthlyDate(reference: Date, dueDay: number): Date {
  const day = Math.min(dueDay, getDaysInMonth(reference));
  return new Date(reference.getFullYear(), reference.getMonth(), day);
}

export function nextDueDate(
  periodicity: Periodicity,
  dueDay: number,
  today: Date = new Date(),
): string {
  const base = startOfDay(today);
  if (periodicity === 'WEEKLY') {
    const offset = (dueDay - getISODay(base) + 7) % 7;
    return format(addDays(base, offset), DATE_FORMAT);
  }
  const thisMonth = monthlyDate(base, dueDay);
  const due = thisMonth >= base ? thisMonth : monthlyDate(addMonths(base, 1), dueDay);
  return format(due, DATE_FORMAT);
}

export function advanceDueDate(periodicity: Periodicity, dueDay: number, current: string): string {
  const date = parseISO(current);
  if (periodicity === 'WEEKLY') {
    return format(addWeeks(date, 1), DATE_FORMAT);
  }
  return format(monthlyDate(addMonths(date, 1), dueDay), DATE_FORMAT);
}
