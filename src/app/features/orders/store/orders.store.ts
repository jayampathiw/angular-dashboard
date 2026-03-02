import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { OrderItem, OrderFilter, OrderStatus, OrderTableState } from '../models/orders.model';
import { MOCK_ORDERS } from '../data/orders-mock.data';

interface OrdersState {
  orders: OrderItem[];
  filter: OrderFilter;
  table: OrderTableState;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  filter: { search: '', status: '' },
  table: {
    pageIndex: 0,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  },
  loading: false,
  error: null,
};

export const OrdersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ orders, filter, table }) => {
    const filteredOrders = computed(() => {
      let result = orders();
      const f = filter();

      if (f.search) {
        const term = f.search.toLowerCase();
        result = result.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(term) ||
            o.customer.toLowerCase().includes(term) ||
            o.email.toLowerCase().includes(term),
        );
      }

      if (f.status) {
        result = result.filter((o) => o.status === f.status);
      }

      return result;
    });

    const sortedOrders = computed(() => {
      const list = [...filteredOrders()];
      const { sortBy, sortDirection } = table();
      const dir = sortDirection === 'asc' ? 1 : -1;

      return list.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.localeCompare(valB) * dir;
        }
        return 0;
      });
    });

    const paginatedOrders = computed(() => {
      const { pageIndex, pageSize } = table();
      const start = pageIndex * pageSize;
      return sortedOrders().slice(start, start + pageSize);
    });

    return {
      filteredOrders,
      sortedOrders,
      paginatedOrders,
      totalFilteredCount: computed(() => filteredOrders().length),
      totalCount: computed(() => orders().length),
      totalRevenue: computed(() =>
        orders().reduce((sum, o) => sum + o.amount, 0),
      ),
      statusCounts: computed(() => {
        const counts: Record<string, number> = {};
        orders().forEach((o) => {
          counts[o.status] = (counts[o.status] || 0) + 1;
        });
        return counts;
      }),
    };
  }),

  withMethods((store) => ({
    loadOrders(): Promise<void> {
      patchState(store, { loading: true, error: null });

      return new Promise((resolve) => {
        setTimeout(() => {
          patchState(store, { orders: MOCK_ORDERS, loading: false });
          resolve();
        }, 400);
      });
    },

    setFilter(patch: Partial<OrderFilter>): void {
      patchState(store, {
        filter: { ...store.filter(), ...patch },
        table: { ...store.table(), pageIndex: 0 },
      });
    },

    clearFilters(): void {
      patchState(store, {
        filter: { search: '', status: '' },
        table: { ...store.table(), pageIndex: 0 },
      });
    },

    setPage(pageIndex: number): void {
      patchState(store, { table: { ...store.table(), pageIndex } });
    },

    setPageSize(pageSize: number): void {
      patchState(store, {
        table: { ...store.table(), pageSize, pageIndex: 0 },
      });
    },

    setSort(sortBy: keyof OrderItem, sortDirection: 'asc' | 'desc'): void {
      patchState(store, {
        table: { ...store.table(), sortBy, sortDirection },
      });
    },

    updateStatus(id: string, status: OrderStatus): void {
      patchState(store, {
        orders: store.orders().map((o) =>
          o.id === id ? { ...o, status } : o,
        ),
      });
    },
  })),
);
