import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { OrderFilter, OrderStatus } from '../../models/orders.model';

@Component({
  selector: 'app-order-filters',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './order-filters.component.html',
  styleUrl: './order-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFiltersComponent implements OnDestroy {
  readonly filterChanged = output<Partial<OrderFilter>>();
  readonly filtersCleared = output<void>();

  readonly searchValue = signal('');
  readonly statusValue = signal<OrderStatus | ''>('');

  readonly statuses = [
    { value: 'pending' as OrderStatus, label: 'Pending' },
    { value: 'processing' as OrderStatus, label: 'Processing' },
    { value: 'shipped' as OrderStatus, label: 'Shipped' },
    { value: 'delivered' as OrderStatus, label: 'Delivered' },
    { value: 'cancelled' as OrderStatus, label: 'Cancelled' },
  ];

  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => this.filterChanged.emit({ search }));
  }

  onSearchInput(value: string): void {
    this.searchValue.set(value);
    this.search$.next(value);
  }

  onStatusChange(status: OrderStatus | ''): void {
    this.statusValue.set(status);
    this.filterChanged.emit({ status });
  }

  clearFilters(): void {
    this.searchValue.set('');
    this.statusValue.set('');
    this.filtersCleared.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
