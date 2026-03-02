import { TestBed } from '@angular/core/testing';
import { OrdersStore } from './orders.store';
import { MOCK_ORDERS } from '../data/orders-mock.data';

describe('OrdersStore', () => {
  let store: InstanceType<typeof OrdersStore>;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({});
    store = TestBed.inject(OrdersStore);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty orders', () => {
      expect(store.orders()).toEqual([]);
    });

    it('should have default filters', () => {
      expect(store.filter()).toEqual({ search: '', status: '' });
    });

    it('should have default table state', () => {
      expect(store.table()).toEqual({
        pageIndex: 0,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      });
    });
  });

  describe('loadOrders', () => {
    it('should set loading to true', () => {
      store.loadOrders();
      expect(store.loading()).toBe(true);
    });

    it('should load mock orders after delay', async () => {
      const promise = store.loadOrders();
      jest.advanceTimersByTime(400);
      await promise;

      expect(store.orders().length).toBe(MOCK_ORDERS.length);
      expect(store.loading()).toBe(false);
    });
  });

  describe('filtering', () => {
    beforeEach(async () => {
      const promise = store.loadOrders();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should filter by search term', () => {
      const firstOrder = MOCK_ORDERS[0];
      store.setFilter({ search: firstOrder.customer });

      expect(
        store.filteredOrders().some((o) => o.customer === firstOrder.customer),
      ).toBe(true);
    });

    it('should filter by status', () => {
      store.setFilter({ status: 'pending' });

      const pending = store.filteredOrders();
      expect(pending.every((o) => o.status === 'pending')).toBe(true);
    });

    it('should reset page on filter change', () => {
      store.setPage(1);
      store.setFilter({ search: 'test' });

      expect(store.table().pageIndex).toBe(0);
    });

    it('should clear filters', () => {
      store.setFilter({ search: 'test', status: 'pending' });
      store.clearFilters();

      expect(store.filter()).toEqual({ search: '', status: '' });
    });
  });

  describe('sorting', () => {
    beforeEach(async () => {
      const promise = store.loadOrders();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should sort by amount ascending', () => {
      store.setSort('amount', 'asc');

      const sorted = store.sortedOrders();
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].amount).toBeGreaterThanOrEqual(sorted[i - 1].amount);
      }
    });

    it('should sort by amount descending', () => {
      store.setSort('amount', 'desc');

      const sorted = store.sortedOrders();
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].amount).toBeLessThanOrEqual(sorted[i - 1].amount);
      }
    });
  });

  describe('pagination', () => {
    beforeEach(async () => {
      const promise = store.loadOrders();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should paginate to default size', () => {
      expect(store.paginatedOrders().length).toBeLessThanOrEqual(10);
    });

    it('should change page size and reset index', () => {
      store.setPageSize(5);

      expect(store.paginatedOrders().length).toBeLessThanOrEqual(5);
      expect(store.table().pageIndex).toBe(0);
    });
  });

  describe('updateStatus', () => {
    beforeEach(async () => {
      const promise = store.loadOrders();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should update order status', () => {
      const orderId = store.orders()[0].id;
      store.updateStatus(orderId, 'shipped');

      const updated = store.orders().find((o) => o.id === orderId);
      expect(updated?.status).toBe('shipped');
    });

    it('should not modify other orders', () => {
      const orderId = store.orders()[0].id;
      const otherOrder = store.orders()[1];

      store.updateStatus(orderId, 'cancelled');

      const unchanged = store.orders().find((o) => o.id === otherOrder.id);
      expect(unchanged?.status).toBe(otherOrder.status);
    });
  });

  describe('computed values', () => {
    beforeEach(async () => {
      const promise = store.loadOrders();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should compute totalRevenue', () => {
      const expectedRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.amount, 0);
      expect(store.totalRevenue()).toBe(expectedRevenue);
    });

    it('should compute statusCounts', () => {
      const counts = store.statusCounts();
      const pendingCount = MOCK_ORDERS.filter(
        (o) => o.status === 'pending',
      ).length;

      expect(counts['pending']).toBe(pendingCount);
    });

    it('should compute totalFilteredCount', () => {
      expect(store.totalFilteredCount()).toBe(MOCK_ORDERS.length);

      store.setFilter({ status: 'pending' });
      const expectedCount = MOCK_ORDERS.filter(
        (o) => o.status === 'pending',
      ).length;
      expect(store.totalFilteredCount()).toBe(expectedCount);
    });
  });
});
