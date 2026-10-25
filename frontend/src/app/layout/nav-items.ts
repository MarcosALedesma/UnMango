import { IconName } from '../shared/icon/icon-paths';

export interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly icon: IconName;
  readonly inBottomBar: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/inicio', label: 'Inicio', shortLabel: 'Inicio', icon: 'home', inBottomBar: true },
  { path: '/gastos', label: 'Gastos', shortLabel: 'Gastos', icon: 'expenses', inBottomBar: true },
  {
    path: '/gastos-fijos',
    label: 'Gastos fijos',
    shortLabel: 'Fijos',
    icon: 'recurring',
    inBottomBar: true,
  },
  { path: '/eventos', label: 'Eventos', shortLabel: 'Eventos', icon: 'events', inBottomBar: true },
  {
    path: '/categorias',
    label: 'Categorías',
    shortLabel: 'Categorías',
    icon: 'categories',
    inBottomBar: false,
  },
  {
    path: '/reportes',
    label: 'Reportes',
    shortLabel: 'Reportes',
    icon: 'reports',
    inBottomBar: false,
  },
  {
    path: '/configuracion',
    label: 'Configuración',
    shortLabel: 'Config.',
    icon: 'settings',
    inBottomBar: false,
  },
];
