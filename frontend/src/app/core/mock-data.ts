//datos hardcodeados
import { addMonths, format, setDate } from 'date-fns';
import { Category } from './models/category.model';
import { Expense, ExpenseOrigin } from './models/expense.model';
import { RecurringExpense } from './models/recurring-expense.model';

const DATE_FORMAT = 'yyyy-MM-dd';

const ars = (pesos: number): number => Math.round(pesos * 100);

function dayOf(monthsAgo: number, day: number): string {
  const today = new Date();
  const maxDay = monthsAgo === 0 ? today.getDate() : 28;
  return format(setDate(addMonths(today, -monthsAgo), Math.min(day, maxDay)), DATE_FORMAT);
}

function nextDue(day: number): string {
  const today = new Date();
  const base = day >= today.getDate() ? today : addMonths(today, 1);
  return format(setDate(base, Math.min(day, 28)), DATE_FORMAT);
}

function expense(
  id: string,
  description: string,
  categoryId: string,
  pesos: number,
  monthsAgo: number,
  day: number,
  origin: ExpenseOrigin = 'PERSONAL',
): Expense {
  return {
    id,
    description,
    categoryId,
    amountMinor: ars(pesos),
    spentAt: dayOf(monthsAgo, day),
    origin,
  };
}

export const MOCK_CATEGORIES: readonly Category[] = [
  { id: 'cat-housing', name: 'Vivienda', icon: 'home', color: '#1fa855' },
  { id: 'cat-food', name: 'Comida', icon: 'utensils', color: '#84cc16' },
  { id: 'cat-transport', name: 'Transporte', icon: 'car', color: '#fbbf24' },
  { id: 'cat-leisure', name: 'Ocio', icon: 'film', color: '#f97316' },
  { id: 'cat-health', name: 'Salud', icon: 'heart', color: '#ef4444' },
  { id: 'cat-subs', name: 'Suscripciones', icon: 'tv', color: '#8b5cf6' },
  { id: 'cat-other', name: 'Otros', icon: 'categories', color: '#94a3b8' },
];

export const MOCK_EXPENSES: readonly Expense[] = [
  expense('e01', 'Supermercado', 'cat-food', 24850, 0, 20),
  expense('e02', 'Colectivo', 'cat-transport', 1200, 0, 19),
  expense('e03', 'Netflix', 'cat-subs', 6900, 0, 18, 'RECURRING'),
  expense('e04', 'Farmacia', 'cat-health', 8450, 0, 17),
  expense('e05', 'Cena con amigos', 'cat-leisure', 32600, 0, 16, 'EVENT'),
  expense('e06', 'Luz', 'cat-housing', 12400, 0, 14, 'RECURRING'),
  expense('e07', 'Nafta', 'cat-transport', 18500, 0, 12),
  expense('e08', 'Verdulería', 'cat-food', 9300, 0, 10),
  expense('e09', 'Cine', 'cat-leisure', 7200, 0, 9),
  expense('e10', 'Internet', 'cat-housing', 8900, 0, 8, 'RECURRING'),
  expense('e11', 'Asado del sábado', 'cat-food', 23630, 0, 6, 'EVENT'),
  expense('e12', 'Alquiler', 'cat-housing', 65000, 0, 5, 'RECURRING'),
  expense('e13', 'Gimnasio', 'cat-health', 12000, 0, 3, 'RECURRING'),
  expense('e14', 'Supermercado', 'cat-food', 27100, 1, 21),
  expense('e15', 'Colectivo', 'cat-transport', 1100, 1, 19),
  expense('e16', 'Netflix', 'cat-subs', 6900, 1, 18, 'RECURRING'),
  expense('e17', 'Cena de cumpleaños', 'cat-leisure', 41800, 1, 16, 'EVENT'),
  expense('e18', 'Farmacia', 'cat-health', 5200, 1, 15),
  expense('e19', 'Luz', 'cat-housing', 11200, 1, 14, 'RECURRING'),
  expense('e20', 'Nafta', 'cat-transport', 21000, 1, 12),
  expense('e21', 'Verdulería', 'cat-food', 8700, 1, 10),
  expense('e22', 'Internet', 'cat-housing', 8900, 1, 8, 'RECURRING'),
  expense('e23', 'Alquiler', 'cat-housing', 65000, 1, 5, 'RECURRING'),
  expense('e24', 'Gimnasio', 'cat-health', 12000, 1, 3, 'RECURRING'),
];

export const MOCK_RECURRING: readonly RecurringExpense[] = [
  {
    id: 'r1',
    name: 'Alquiler',
    categoryId: 'cat-housing',
    amountMinor: ars(65000),
    periodicity: 'MONTHLY',
    nextDueDate: nextDue(5),
    active: true,
  },
  {
    id: 'r2',
    name: 'Luz',
    categoryId: 'cat-housing',
    amountMinor: ars(12400),
    periodicity: 'MONTHLY',
    nextDueDate: nextDue(28),
    active: true,
  },
  {
    id: 'r3',
    name: 'Internet',
    categoryId: 'cat-housing',
    amountMinor: ars(8900),
    periodicity: 'MONTHLY',
    nextDueDate: nextDue(27),
    active: true,
  },
  {
    id: 'r4',
    name: 'Netflix',
    categoryId: 'cat-subs',
    amountMinor: ars(6900),
    periodicity: 'MONTHLY',
    nextDueDate: nextDue(18),
    active: true,
  },
  {
    id: 'r5',
    name: 'Gimnasio',
    categoryId: 'cat-health',
    amountMinor: ars(12000),
    periodicity: 'MONTHLY',
    nextDueDate: nextDue(22),
    active: true,
  },
];
