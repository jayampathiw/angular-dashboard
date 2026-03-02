import { TestBed } from '@angular/core/testing';
import { DashboardStore } from './dashboard.store';
import {
  MOCK_KPI_METRICS,
  MOCK_REVENUE_DATA,
  MOCK_CATEGORY_DATA,
  MOCK_DISTRIBUTION_DATA,
  MOCK_ACTIVITIES,
} from '../data/dashboard-mock.data';

describe('DashboardStore', () => {
  let store: InstanceType<typeof DashboardStore>;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({});
    store = TestBed.inject(DashboardStore);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty data arrays', () => {
      expect(store.kpis()).toEqual([]);
      expect(store.revenueData()).toEqual([]);
      expect(store.categoryData()).toEqual([]);
      expect(store.distributionData()).toEqual([]);
      expect(store.activities()).toEqual([]);
    });

    it('should not be loading', () => {
      expect(store.loading()).toBe(false);
    });

    it('should have no error', () => {
      expect(store.error()).toBeNull();
    });
  });

  describe('loadDashboardData', () => {
    it('should set loading to true immediately', () => {
      store.loadDashboardData();
      expect(store.loading()).toBe(true);
    });

    it('should load mock data after delay', async () => {
      const promise = store.loadDashboardData();
      jest.advanceTimersByTime(600);
      await promise;

      expect(store.kpis()).toEqual(MOCK_KPI_METRICS);
      expect(store.revenueData()).toEqual(MOCK_REVENUE_DATA);
      expect(store.categoryData()).toEqual(MOCK_CATEGORY_DATA);
      expect(store.distributionData()).toEqual(MOCK_DISTRIBUTION_DATA);
      expect(store.activities()).toEqual(MOCK_ACTIVITIES);
    });

    it('should set loading to false after data loads', async () => {
      const promise = store.loadDashboardData();
      jest.advanceTimersByTime(600);
      await promise;

      expect(store.loading()).toBe(false);
    });

    it('should clear error when loading', () => {
      store.loadDashboardData();
      expect(store.error()).toBeNull();
    });
  });

  describe('computed values', () => {
    beforeEach(async () => {
      const promise = store.loadDashboardData();
      jest.advanceTimersByTime(600);
      await promise;
    });

    it('should compute totalRevenue from KPIs', () => {
      const revenueKpi = MOCK_KPI_METRICS.find((k) => k.id === 'revenue');
      expect(store.totalRevenue()).toBe(revenueKpi?.value ?? 0);
    });

    it('should compute revenueGrowth from last two data points', () => {
      const data = MOCK_REVENUE_DATA;
      const current = data[data.length - 1].revenue;
      const previous = data[data.length - 2].revenue;
      const expectedGrowth =
        Math.round(((current - previous) / previous) * 100 * 10) / 10;

      expect(store.revenueGrowth()).toBe(expectedGrowth);
    });

    it('should limit recentActivities to 8 items', () => {
      expect(store.recentActivities().length).toBeLessThanOrEqual(8);
    });

    it('should return 0 for revenueGrowth with insufficient data', () => {
      // Initially (before load), revenueData is empty
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshStore = TestBed.inject(DashboardStore);
      expect(freshStore.revenueGrowth()).toBe(0);
    });
  });
});
