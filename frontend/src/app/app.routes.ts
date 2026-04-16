import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MarketDetail } from './pages/market-detail/market-detail';
import { CreateMarket } from './pages/create-market/create-market';
import { Auth } from './pages/auth/auth';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'markets/:id', component: MarketDetail },
  { path: 'create', component: CreateMarket },
  { path: 'auth', component: Auth },
  { path: '**', redirectTo: '' }
];
