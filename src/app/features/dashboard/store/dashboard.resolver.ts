import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DashboardStore } from './dashboard.store';

export const dashboardResolver: ResolveFn<boolean> = () => {
  const store = inject(DashboardStore);
  return store.loadDashboardData().then(() => true);
};
