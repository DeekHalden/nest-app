import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { CookieSessionModule } from 'nestjs-cookie-session';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { RolesModule } from '../src/roles/roles.module';
import { EmailerModule } from '../src/mailer/emailer.module';
import { ProductModule } from '../src/product/product.module';
import { FileModule } from '../src/file/file.module';
import { CartModule } from '../src/cart/cart.module';
import appConfig from '../src/config/app.config';
import { LoggerConfig } from '../src/config/logger.config';
import { CookieMiddleware } from '../src/common/cookie.middleware';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const logger: LoggerConfig = new LoggerConfig();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CookieSessionModule.forRoot({
          session: { secret: process.env.SESSION_SECRET },
        }),
        WinstonModule.forRoot(logger.console()),
        TypeOrmModule.forRoot({
          name: 'default',
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'postgres',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: false,
        }),
        
        
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    // app.use(CookieMiddleware);
    await app.init();
  });

  it('/token (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/');
    console.log(res);
  });
});
