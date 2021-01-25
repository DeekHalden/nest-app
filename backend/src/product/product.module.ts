import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';

import { Product } from './entities/product.entity';
import { File } from '../file/entities/file.entity';
import { AzureStorageModule, AzureStorageService } from '@nestjs/azure-storage';
import { FileService } from '../file/file.service';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [
    AzureStorageModule.withConfig({
      sasKey: process.env['AZURE_STORAGE_SAS_KEY'],
      accountName: process.env['AZURE_STORAGE_ACCOUNT'],
      containerName: 'basic',
    }),
    TypeOrmModule.forFeature([Product, File, Event]),
  ],
  providers: [ProductService, AzureStorageService, FileService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
