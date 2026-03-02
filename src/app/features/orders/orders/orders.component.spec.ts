import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrdersComponent } from './orders.component';
import { OrdersStore } from '../store/orders.store';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let store: InstanceType<typeof OrdersStore>;

  beforeEach(() => {
    jest.useFakeTimers();

    TestBed.configureTestingModule({
      imports: [OrdersComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    store = TestBed.inject(OrdersStore);
    const fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate filter changes to store', () => {
    const spy = jest.spyOn(store, 'setFilter');
    component.onFilterChanged({ search: 'test' });

    expect(spy).toHaveBeenCalledWith({ search: 'test' });
  });

  it('should delegate filter clear to store', () => {
    const spy = jest.spyOn(store, 'clearFilters');
    component.onFiltersCleared();

    expect(spy).toHaveBeenCalled();
  });

  it('should delegate sort changes to store', () => {
    const spy = jest.spyOn(store, 'setSort');
    component.onSortChanged({ active: 'amount', direction: 'desc' });

    expect(spy).toHaveBeenCalledWith('amount', 'desc');
  });

  it('should delegate page change to store', () => {
    const spy = jest.spyOn(store, 'setPage');
    component.onPageChanged({
      pageIndex: 1,
      pageSize: 10,
      length: 25,
      previousPageIndex: 0,
    });

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should change page size when it differs', async () => {
    const promise = store.loadOrders();
    jest.advanceTimersByTime(400);
    await promise;

    const spy = jest.spyOn(store, 'setPageSize');
    component.onPageChanged({
      pageIndex: 0,
      pageSize: 25,
      length: 25,
      previousPageIndex: 0,
    });

    expect(spy).toHaveBeenCalledWith(25);
  });

  it('should delegate status change to store', () => {
    const spy = jest.spyOn(store, 'updateStatus');
    component.onStatusChanged({ id: 'ord-001', status: 'shipped' });

    expect(spy).toHaveBeenCalledWith('ord-001', 'shipped');
  });
});
