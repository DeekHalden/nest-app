import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/roles/entities/role.entity';
import { UsersService } from 'src/users/users.service';

const matchRoles = (roles, userRoles): boolean =>
  userRoles.some((r: Role) => roles.find((role) => role === r.title));

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    return matchRoles(roles, user.roles);
  }
}
