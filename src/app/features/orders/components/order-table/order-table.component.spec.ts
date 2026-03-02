import { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrderTableComponent } from './order-table.component';
import { OrderItem, OrderStatus } from '../../models/orders.model';

const mockOrders: OrderItem[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-1001',
    customer: 'John Doe',
    email: 'john@example.com',
    items: 3,
    amount: 299.99,
    status: 'pending',
    createdAt: '2025-01-15',
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-1002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    items: 1,
    amount: 49.99,
    status: 'shipped',
    createdAt: '2025-01-14',
  },
];

describe('OrderTableComponent', () => {
  let component: OrderTableComponent;
  let componentRef: ComponentRef<OrderTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(OrderTableComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('orders', mockOrders);
    componentRef.setInput('totalCount', 25);
    componentRef.setInput('pageIndex', 0);
    componentRef.setInput('pageSize', 10);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual([
      'orderNumber', 'customer', 'items', 'amount', 'status', 'createdAt', 'actions',
    ]);
  });

  it('should have status config for all statuses', () => {
    const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    statuses.forEach((status) => {
      const config = component.getStatusConfig(status);
      expect(config.label).toBeTruthy();
      expect(config.class).toBeTruthy();
      expect(config.icon).toBeTruthy();
    });
  });

  it('should have all status transitions', () => {
    expect(component.statusTransitions).toEqual([
      'pending', 'processing', 'shipped', 'delivered', 'cancelled',
    ]);
  });

  it('should emit sortChanged on sort with direction', () => {
    const spy = jest.fn();
    component.sortChanged.subscribe(spy);

    component.onSortChange({ active: 'amount', direction: 'asc' });

    expect(spy).toHaveBeenCalledWith({ active: 'amount', direction: 'asc' });
  });

  it('should not emit sortChanged when direction is empty', () => {
    const spy = jest.fn();
    component.sortChanged.subscribe(spy);

    component.onSortChange({ active: 'amount', direction: '' });

    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit pageChanged', () => {
    const spy = jest.fn();
    component.pageChanged.subscribe(spy);

    const event = { pageIndex: 1, pageSize: 10, length: 25, previousPageIndex: 0 };
    component.onPageChange(event);

    expect(spy).toHaveBeenCalledWith(event);
  });

  it('should emit statusChanged', () => {
    const spy = jest.fn();
    component.statusChanged.subscribe(spy);

    component.onStatusChange('ord-001', 'shipped');

    expect(spy).toHaveBeenCalledWith({ id: 'ord-001', status: 'shipped' });
  });
});
