import { OrderItem } from '../models/orders.model';

const customers = [
  { name: 'Sarah Chen', email: 'sarah.chen@acme.io' },
  { name: 'James Rodriguez', email: 'james.rodriguez@acme.io' },
  { name: 'Emily Watson', email: 'emily.watson@acme.io' },
  { name: 'Michael Park', email: 'michael.park@acme.io' },
  { name: 'Priya Sharma', email: 'priya.sharma@acme.io' },
  { name: 'David Kim', email: 'david.kim@acme.io' },
  { name: 'Lisa Anderson', email: 'lisa.anderson@acme.io' },
  { name: 'Alex Thompson', email: 'alex.thompson@acme.io' },
  { name: 'Maria Garcia', email: 'maria.garcia@acme.io' },
  { name: 'Kevin Wright', email: 'kevin.wright@acme.io' },
];

const statuses: OrderItem['status'][] = [
  'pending', 'processing', 'shipped', 'delivered', 'delivered',
  'delivered', 'shipped', 'processing', 'cancelled', 'delivered',
];

function generateOrders(): OrderItem[] {
  return Array.from({ length: 25 }, (_, i) => {
    const customer = customers[i % customers.length];
    const status = statuses[i % statuses.length];
    const day = 28 - i;
    const month = day > 0 ? '02' : '01';
    const d = day > 0 ? day : 28 + day;

    return {
      id: `ord-${String(i + 1).padStart(3, '0')}`,
      orderNumber: `ORD-${String(2400 + i).padStart(5, '0')}`,
      customer: customer.name,
      email: customer.email,
      items: Math.floor(Math.random() * 8) + 1,
      amount: Math.round((Math.random() * 900 + 50) * 100) / 100,
      status,
      createdAt: `2026-${month}-${String(d).padStart(2, '0')}T${String(8 + (i % 12))}:${String(i * 7 % 60).padStart(2, '0')}:00Z`,
    };
  });
}

export const MOCK_ORDERS: OrderItem[] = generateOrders();
