import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard, guestGuard } from './core/auth/auth.guard';
import { dashboardResolver } from './features/dashboard/store/dashboard.resolver';
import { usersResolver } from './features/users/store/users.resolver';
import { ordersResolver } from './features/orders/store/orders.resolver';
import { analyticsResolver } from './features/analytics/store/analytics.resolver';

export const routes: Routes = [
  // Auth pages — no layout wrapper, guest-only
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        resolve: { dashboard: dashboardResolver },
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users/users.component').then(
            (m) => m.UsersComponent,
          ),
        resolve: { users: usersResolver },
        data: { breadcrumb: 'Users' },
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders/orders.component').then(
            (m) => m.OrdersComponent,
          ),
        resolve: { orders: ordersResolver },
        data: { breadcrumb: 'Orders' },
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/analytics/analytics.component').then(
            (m) => m.AnalyticsComponent,
          ),
        resolve: { analytics: analyticsResolver },
        data: { breadcrumb: 'Analytics' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
        data: { breadcrumb: 'Settings' },
      },
    ],
  },

  { path: '**', redirectTo: 'auth/login' },
];
