import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CookieSessionModule } from 'nestjs-cookie-session';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoggerConfig } from '../src/config/logger.config';
import { CookieMiddleware } from '../src/common/cookie.middleware';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const logger: LoggerConfig = new LoggerConfig();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        // CookieSessionModule.forRoot({
        //   session: { secret: process.env.SESSION_SECRET },
        // }),
        // WinstonModule.forRoot(logger.console()),
        // TypeOrmModule.forRoot({
        //   name: 'default',
        //   type: 'postgres',
        //   host: 'localhost',
        //   port: 5433,
        //   username: 'postgres',
        //   password: 'postgres',
        //   database: 'postgres',
        //   autoLoadEntities: true,
        //   synchronize: false,
        // }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    // app.use(CookieMiddleware);
    await app.init();
  });

  it('/token (GET)', async () => {
    return request(app.getHttpServer()).get('/token').expect(200);
  });
});
