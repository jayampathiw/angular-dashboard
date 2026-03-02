export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Users', icon: 'people', route: '/users' },
  { label: 'Orders', icon: 'shopping_cart', route: '/orders', badge: 3 },
  { label: 'Analytics', icon: 'bar_chart', route: '/analytics' },
  { label: 'Settings', icon: 'settings', route: '/settings' },
];
