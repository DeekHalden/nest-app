import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CookieMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('token:', req.csrfToken());
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  }
}
