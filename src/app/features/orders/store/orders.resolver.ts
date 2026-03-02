import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OrdersStore } from './orders.store';

export const ordersResolver: ResolveFn<boolean> = () => {
  const store = inject(OrdersStore);
  return store.loadOrders().then(() => true);
};
