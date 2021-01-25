import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { VERIFIED } from './../decorators/verified.decorator';

@Injectable()
export class VerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiresVerify = this.reflector.get<boolean>(
      VERIFIED,
      context.getHandler(),
    );
    if (!requiresVerify) return true;
    const { user } = context.switchToHttp().getRequest();
    return user.isActive;
  }
}
