import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { OrderItem, OrderStatus } from '../../models/orders.model';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
  ],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTableComponent {
  readonly orders = input.required<OrderItem[]>();
  readonly totalCount = input.required<number>();
  readonly pageIndex = input.required<number>();
  readonly pageSize = input.required<number>();

  readonly sortChanged = output<{ active: string; direction: 'asc' | 'desc' }>();
  readonly pageChanged = output<PageEvent>();
  readonly statusChanged = output<{ id: string; status: OrderStatus }>();

  readonly displayedColumns = [
    'orderNumber',
    'customer',
    'items',
    'amount',
    'status',
    'createdAt',
    'actions',
  ];

  readonly statusConfig: Record<OrderStatus, { label: string; class: string; icon: string }> = {
    pending: { label: 'Pending', class: 'status-pending', icon: 'schedule' },
    processing: { label: 'Processing', class: 'status-processing', icon: 'sync' },
    shipped: { label: 'Shipped', class: 'status-shipped', icon: 'local_shipping' },
    delivered: { label: 'Delivered', class: 'status-delivered', icon: 'check_circle' },
    cancelled: { label: 'Cancelled', class: 'status-cancelled', icon: 'cancel' },
  };

  readonly statusTransitions: OrderStatus[] = [
    'pending', 'processing', 'shipped', 'delivered', 'cancelled',
  ];

  getStatusConfig(status: OrderStatus): { label: string; class: string; icon: string } {
    return this.statusConfig[status];
  }

  onSortChange(sort: Sort): void {
    if (sort.direction) {
      this.sortChanged.emit({
        active: sort.active,
        direction: sort.direction as 'asc' | 'desc',
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageChanged.emit(event);
  }

  onStatusChange(id: string, status: OrderStatus): void {
    this.statusChanged.emit({ id, status });
  }
}
