import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { OrderTableComponent } from '../components/order-table/order-table.component';
import { OrderFiltersComponent } from '../components/order-filters/order-filters.component';
import { OrdersStore } from '../store/orders.store';
import { OrderFilter, OrderItem, OrderStatus } from '../models/orders.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DecimalPipe, OrderTableComponent, OrderFiltersComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  readonly store = inject(OrdersStore);

  onFilterChanged(patch: Partial<OrderFilter>): void {
    this.store.setFilter(patch);
  }

  onFiltersCleared(): void {
    this.store.clearFilters();
  }

  onSortChanged(event: { active: string; direction: 'asc' | 'desc' }): void {
    this.store.setSort(event.active as keyof OrderItem, event.direction);
  }

  onPageChanged(event: PageEvent): void {
    if (event.pageSize !== this.store.table().pageSize) {
      this.store.setPageSize(event.pageSize);
    } else {
      this.store.setPage(event.pageIndex);
    }
  }

  onStatusChanged(event: { id: string; status: OrderStatus }): void {
    this.store.updateStatus(event.id, event.status);
  }
}
