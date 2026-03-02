import { TestBed } from '@angular/core/testing';
import { dashboardResolver } from './dashboard.resolver';
import { DashboardStore } from './dashboard.store';

describe('dashboardResolver', () => {
  let mockStore: { loadDashboardData: jest.Mock };

  beforeEach(() => {
    mockStore = {
      loadDashboardData: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: DashboardStore, useValue: mockStore }],
    });
  });

  it('should call loadDashboardData', async () => {
    const result = await TestBed.runInInjectionContext(() =>
      dashboardResolver({} as any, {} as any),
    );
    expect(mockStore.loadDashboardData).toHaveBeenCalled();
  });

  it('should return true after data loads', async () => {
    const result = await TestBed.runInInjectionContext(() =>
      dashboardResolver({} as any, {} as any),
    );
    expect(result).toBe(true);
  });
});
