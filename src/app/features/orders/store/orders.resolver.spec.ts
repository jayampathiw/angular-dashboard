import { TestBed } from '@angular/core/testing';
import { ordersResolver } from './orders.resolver';
import { OrdersStore } from './orders.store';

describe('ordersResolver', () => {
  let mockStore: { loadOrders: jest.Mock };

  beforeEach(() => {
    mockStore = {
      loadOrders: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: OrdersStore, useValue: mockStore }],
    });
  });

  it('should call loadOrders', async () => {
    await TestBed.runInInjectionContext(() =>
      ordersResolver({} as any, {} as any),
    );
    expect(mockStore.loadOrders).toHaveBeenCalled();
  });

  it('should return true after data loads', async () => {
    const result = await TestBed.runInInjectionContext(() =>
      ordersResolver({} as any, {} as any),
    );
    expect(result).toBe(true);
  });
});
