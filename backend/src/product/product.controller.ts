import {
  AzureStorageFileInterceptor,
  AzureStorageService,
  UploadedFileMetadata,
} from '@nestjs/azure-storage';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { UserDecorator } from '../common/decorators/user.decorator';
import { FileService, unlink } from '../file/file.service';
import { UserRole } from '../roles/entities/role.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import * as fs from 'fs/promises';
import * as multer from 'multer';
import { CreateFileDto } from 'src/file/dto/create-file.dto';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

type IUploadedFiles = {
  images: UploadedFileMetadata[];
  image: UploadedFileMetadata;
};

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileService: FileService,
  ) {}

  @Post('create')
  @RoleDecorator(UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'image', maxCount: 1 }, { name: 'images' }],
      { storage },
    ),
  )
  async createProduct(
    @UploadedFiles() { images, image },
    @Body() body,
    @UserDecorator() user,
  ): Promise<any> {
    return await this.productService
      .create(body, image[0], images)
      .catch(async (err) => {
        const imagesProxy: CreateFileDto[] = [image[0], ...images].map(
          ({ filename, path }) => ({
            url: path,
            name: filename,
          }),
        );
        await Promise.all(
          imagesProxy.map(async (file) => await unlink(file.url)),
        );
        throw err;
      });
  }

  @Delete(':id/delete')
  @RoleDecorator(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<any> {
    return await this.productService.remove(parseInt(id, 10));
  }

  @Get()
  async getProducts(@Param() query: any): Promise<ProductDto[]> {
    return await this.productService.findAll({
      relations: ['image', 'images'],
    });
  }
}
