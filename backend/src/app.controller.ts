import { Controller, Get, Request, Response } from '@nestjs/common';
import { Response as Res } from 'express';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Get('token')
  @Public()
  getHello(@Request() req, @Response() res: Res): any {
    return res.json({ token: req.csrfToken() });
  }
}
