import { Controller, Get, Render, Response } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(@Response() res): any {
    console.log(this.configService.get('environment'))
    return res.render('index.html', {
      NODE_ENV: this.configService.get('environment'),
    });
  }
}
