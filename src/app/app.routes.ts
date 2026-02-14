import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/clientes',
    pathMatch: 'full'
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('../features/clientes/components/cliente-list/cliente-list.component').then(
        (m) => m.ClienteListComponent
      )
  },
  {
    path: 'clientes/detalle/:id',
    loadComponent: () =>
      import('../features/clientes/components/cliente-detalle/cliente-detalle.component').then(
        (m) => m.ClienteDetalleComponent
      )
  },
  {
    path: '**',
    redirectTo: '/clientes'
  }
];
