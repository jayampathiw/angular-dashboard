import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import {
  UserItem,
  UserFilter,
  UserStatus,
  UserTableState,
} from '../models/users.model';
import { Role } from '../../../core/models/auth.model';
import { MOCK_USERS } from '../data/users-mock.data';

interface UsersState {
  users: UserItem[];
  filter: UserFilter;
  table: UserTableState;
  selectedIds: Set<string>;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  filter: { search: '', role: '', status: '' },
  table: {
    pageIndex: 0,
    pageSize: 10,
    sortBy: 'lastName',
    sortDirection: 'asc',
  },
  selectedIds: new Set<string>(),
  loading: false,
  error: null,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ users, filter, table, selectedIds }) => {
    const filteredUsers = computed(() => {
      let result = users();
      const f = filter();

      if (f.search) {
        const term = f.search.toLowerCase();
        result = result.filter(
          (u) =>
            u.firstName.toLowerCase().includes(term) ||
            u.lastName.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.department.toLowerCase().includes(term),
        );
      }

      if (f.role) {
        result = result.filter((u) => u.role === f.role);
      }

      if (f.status) {
        result = result.filter((u) => u.status === f.status);
      }

      return result;
    });

    const sortedUsers = computed(() => {
      const list = [...filteredUsers()];
      const { sortBy, sortDirection } = table();
      const dir = sortDirection === 'asc' ? 1 : -1;

      return list.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.localeCompare(valB) * dir;
        }
        return 0;
      });
    });

    const paginatedUsers = computed(() => {
      const { pageIndex, pageSize } = table();
      const start = pageIndex * pageSize;
      return sortedUsers().slice(start, start + pageSize);
    });

    return {
      filteredUsers,
      sortedUsers,
      paginatedUsers,
      totalFilteredCount: computed(() => filteredUsers().length),
      totalCount: computed(() => users().length),
      activeCount: computed(
        () => users().filter((u) => u.status === 'active').length,
      ),
      adminCount: computed(
        () => users().filter((u) => u.role === Role.Admin).length,
      ),
      selectedCount: computed(() => selectedIds().size),
      hasSelection: computed(() => selectedIds().size > 0),
      allPageSelected: computed(() => {
        const page = paginatedUsers();
        const ids = selectedIds();
        return page.length > 0 && page.every((u) => ids.has(u.id));
      }),
    };
  }),

  withMethods((store) => ({
    loadUsers(): Promise<void> {
      patchState(store, { loading: true, error: null });

      return new Promise((resolve) => {
        setTimeout(() => {
          patchState(store, { users: MOCK_USERS, loading: false });
          resolve();
        }, 400);
      });
    },

    setFilter(patch: Partial<UserFilter>): void {
      patchState(store, {
        filter: { ...store.filter(), ...patch },
        table: { ...store.table(), pageIndex: 0 },
      });
    },

    clearFilters(): void {
      patchState(store, {
        filter: { search: '', role: '', status: '' },
        table: { ...store.table(), pageIndex: 0 },
      });
    },

    setPage(pageIndex: number): void {
      patchState(store, {
        table: { ...store.table(), pageIndex },
        selectedIds: new Set<string>(),
      });
    },

    setPageSize(pageSize: number): void {
      patchState(store, {
        table: { ...store.table(), pageSize, pageIndex: 0 },
        selectedIds: new Set<string>(),
      });
    },

    setSort(sortBy: keyof UserItem, sortDirection: 'asc' | 'desc'): void {
      patchState(store, {
        table: { ...store.table(), sortBy, sortDirection },
      });
    },

    toggleSelection(id: string): void {
      const ids = new Set(store.selectedIds());
      if (ids.has(id)) {
        ids.delete(id);
      } else {
        ids.add(id);
      }
      patchState(store, { selectedIds: ids });
    },

    togglePageSelection(): void {
      const page = store.paginatedUsers();
      const ids = new Set(store.selectedIds());
      const allSelected = page.every((u) => ids.has(u.id));

      if (allSelected) {
        page.forEach((u) => ids.delete(u.id));
      } else {
        page.forEach((u) => ids.add(u.id));
      }
      patchState(store, { selectedIds: ids });
    },

    clearSelection(): void {
      patchState(store, { selectedIds: new Set<string>() });
    },

    createUser(
      user: Omit<UserItem, 'id' | 'avatar' | 'createdAt' | 'lastLogin'>,
    ): void {
      const newUser: UserItem = {
        ...user,
        id: `usr-${String(store.users().length + 1).padStart(3, '0')}`,
        avatar: `${user.firstName[0]}${user.lastName[0]}`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      patchState(store, { users: [newUser, ...store.users()] });
    },

    updateUser(id: string, changes: Partial<UserItem>): void {
      patchState(store, {
        users: store.users().map((u) => (u.id === id ? { ...u, ...changes } : u)),
      });
    },

    deleteUser(id: string): void {
      patchState(store, {
        users: store.users().filter((u) => u.id !== id),
        selectedIds: (() => {
          const ids = new Set(store.selectedIds());
          ids.delete(id);
          return ids;
        })(),
      });
    },

    deleteSelected(): void {
      const ids = store.selectedIds();
      patchState(store, {
        users: store.users().filter((u) => !ids.has(u.id)),
        selectedIds: new Set<string>(),
      });
    },

    updateStatus(id: string, status: UserStatus): void {
      patchState(store, {
        users: store.users().map((u) => (u.id === id ? { ...u, status } : u)),
      });
    },
  })),
);
