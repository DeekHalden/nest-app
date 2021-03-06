import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/roles/entities/role.entity';
import { ROLE_CONSTANT } from '../decorators/role.decorator';

const matchRoles = (roles, userRoles): boolean =>
  userRoles.some((r: Role) => roles.find((role) => role === r.title));

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(
      ROLE_CONSTANT,
      context.getHandler(),
    );
    if (!roles || !roles.length) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return matchRoles(roles, user.roles);
  }
}
