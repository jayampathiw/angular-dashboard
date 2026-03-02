import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UsersStore } from './users.store';

export const usersResolver: ResolveFn<boolean> = () => {
  const store = inject(UsersStore);
  return store.loadUsers().then(() => true);
};
