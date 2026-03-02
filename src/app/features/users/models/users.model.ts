import { Role } from '../../../core/models/auth.model';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: Role;
  status: UserStatus;
  department: string;
  createdAt: string;
  lastLogin: string;
}

export interface UserFilter {
  search: string;
  role: Role | '';
  status: UserStatus | '';
}

export interface UserTableState {
  pageIndex: number;
  pageSize: number;
  sortBy: keyof UserItem;
  sortDirection: 'asc' | 'desc';
}
