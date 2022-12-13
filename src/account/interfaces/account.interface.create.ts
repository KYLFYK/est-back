import { TRole } from '../types/role';

export interface IAccountCreate {
  email: string;
  phone: string;
  role: TRole;
  markAsDelete: boolean;
  isConfirmed: boolean;
}
