import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import { UsersModule } from './users/users.module';
import { WinstonModule } from 'nest-winston';
import { LoggerConfig } from './config/logger.config';
import { RolesModule } from './roles/roles.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { EmailerModule } from './mailer/emailer.module';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { FileModule } from './file/file.module';
import { AzureStorageModule } from '@nestjs/azure-storage';
import { VerifiedGuard } from './common/guards/verified.guard';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
const logger: LoggerConfig = new LoggerConfig();
@Module({
  imports: [
    AzureStorageModule.withConfig({
      sasKey: process.env['AZURE_STORAGE_SAS_KEY'],
      accountName: process.env['AZURE_STORAGE_ACCOUNT'],
      containerName: 'basic',
    }),
    WinstonModule.forRoot(logger.console()),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    MailerModule.forRoot({
      transport: process.env.MAILER_CONFIG,
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
      load: [appConfig],
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    EmailerModule,
    ProductModule,
    FileModule,
    CartModule,
  ],
  controllers: [ProductController, CartController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: VerifiedGuard,
    },
    CartService,
  ],
  exports: [AzureStorageModule],
})
export class AppModule {}
