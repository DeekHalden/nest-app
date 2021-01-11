import { UserDto } from '../users/dto/user.dto';

import { UserRole } from '../roles/entities/role.entity';

export enum RedirectPriority {
  'admin' = 0,
  'manager' = 1,
  'courier' = 2,
  'customer' = 3,
}

export const getUserRedirect = ({ roles }: UserDto): string => {
  return '/cabinet/';
};
