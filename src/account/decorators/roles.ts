import { SetMetadata } from '@nestjs/common';
import { TRole } from '../types/role';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: TRole[]): any => {

  return SetMetadata(ROLES_KEY, roles);
};
