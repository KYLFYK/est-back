import { TRole } from '../types/role';

export interface IAccountChange {
  email?: string;
  phone?: string;
  role?: TRole;
  markAsDelete?: boolean;
}
