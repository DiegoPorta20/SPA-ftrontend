import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/clientes',
    pathMatch: 'full'
  },
  {
    path: 'clientes',
    loadComponent: () => import('./features/clientes/components/cliente-list/cliente-list.component')
      .then(m => m.ClienteListComponent)
  },
  {
    path: 'clientes/nuevo',
    loadComponent: () => import('./features/clientes/components/cliente-form/cliente-form.component')
      .then(m => m.ClienteFormComponent)
  },
  {
    path: 'clientes/editar/:id',
    loadComponent: () => import('./features/clientes/components/cliente-form/cliente-form.component')
      .then(m => m.ClienteFormComponent)
  },
  {
    path: 'clientes/detalle/:id',
    loadComponent: () => import('./features/clientes/components/cliente-detalle/cliente-detalle.component')
      .then(m => m.ClienteDetalleComponent)
  },
  {
    path: '**',
    redirectTo: '/clientes'
  }
];
