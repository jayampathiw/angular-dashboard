import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AnalyticsStore } from './analytics.store';

export const analyticsResolver: ResolveFn<boolean> = () => {
  const store = inject(AnalyticsStore);
  return store.loadAnalytics().then(() => true);
};
