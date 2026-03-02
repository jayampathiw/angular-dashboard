import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderFiltersComponent } from './order-filters.component';

describe('OrderFiltersComponent', () => {
  let component: OrderFiltersComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderFiltersComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(OrderFiltersComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have all order statuses', () => {
    expect(component.statuses.length).toBe(5);
    expect(component.statuses.map((s) => s.value)).toEqual([
      'pending', 'processing', 'shipped', 'delivered', 'cancelled',
    ]);
  });

  it('should emit filter on search with debounce', fakeAsync(() => {
    const spy = jest.fn();
    component.filterChanged.subscribe(spy);

    component.onSearchInput('test');
    expect(spy).not.toHaveBeenCalled();

    tick(300);
    expect(spy).toHaveBeenCalledWith({ search: 'test' });
  }));

  it('should emit filter on status change immediately', () => {
    const spy = jest.fn();
    component.filterChanged.subscribe(spy);

    component.onStatusChange('shipped');

    expect(spy).toHaveBeenCalledWith({ status: 'shipped' });
  });

  it('should update signal values', () => {
    component.onSearchInput('query');
    expect(component.searchValue()).toBe('query');

    component.onStatusChange('pending');
    expect(component.statusValue()).toBe('pending');
  });

  it('should clear all filters', () => {
    const spy = jest.fn();
    component.filtersCleared.subscribe(spy);

    component.onSearchInput('test');
    component.onStatusChange('shipped');
    component.clearFilters();

    expect(component.searchValue()).toBe('');
    expect(component.statusValue()).toBe('');
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit duplicate search values', fakeAsync(() => {
    const spy = jest.fn();
    component.filterChanged.subscribe(spy);

    component.onSearchInput('test');
    tick(300);
    component.onSearchInput('test');
    tick(300);

    expect(spy).toHaveBeenCalledTimes(1);
  }));
});
