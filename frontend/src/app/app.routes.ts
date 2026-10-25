import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        title: 'Inicio · UnMango',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'gastos',
        title: 'Gastos · UnMango',
        loadComponent: () =>
          import('./features/gastos/gastos.component').then((m) => m.GastosComponent),
      },
      {
        path: 'gastos-fijos',
        title: 'Gastos fijos · UnMango',
        loadComponent: () =>
          import('./features/gastos-fijos/gastos-fijos.component').then(
            (m) => m.GastosFijosComponent,
          ),
      },
      {
        path: 'eventos',
        title: 'Eventos · UnMango',
        loadComponent: () =>
          import('./features/eventos/eventos.component').then((m) => m.EventosComponent),
      },
      {
        path: 'configuracion',
        title: 'Configuración · UnMango',
        loadComponent: () =>
          import('./features/configuracion/configuracion.component').then(
            (m) => m.ConfiguracionComponent,
          ),
      },
      {
        path: 'categorias',
        title: 'Categorías · UnMango',
        loadComponent: () =>
          import('./features/categorias/categorias.component').then((m) => m.CategoriasComponent),
      },
      {
        path: 'reportes',
        title: 'Reportes · UnMango',
        loadComponent: () =>
          import('./features/reportes/reportes.component').then((m) => m.ReportesComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
