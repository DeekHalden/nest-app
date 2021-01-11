import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/roles/entities/role.entity';

export const ROLE_CONSTANT = 'roles';
export const RoleDecorator = (...rolesArray: UserRole[]) =>
  SetMetadata(ROLE_CONSTANT, rolesArray);
