import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const {
      user: { email, id },
    } = ctx.switchToHttp().getRequest();
    return { email, id };
  },
);
