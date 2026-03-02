export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  items: number;
  amount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderFilter {
  search: string;
  status: OrderStatus | '';
}

export interface OrderTableState {
  pageIndex: number;
  pageSize: number;
  sortBy: keyof OrderItem;
  sortDirection: 'asc' | 'desc';
}
