import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Network } from './network/network';
import { Operation } from './operation/operation';
import { NetworkSearch } from './network/network-search/network-search';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'frontend/home',
  },
  {
    path: 'frontend/home',
    component: Home,
  },
  {
    path: 'frontend/network',
    component: Network,
  },
  {
    path: 'frontend/network/search',
    component: NetworkSearch,
  },
  {
    path: 'frontend/operation',
    component: Operation,
  },
];
