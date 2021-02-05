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
import { FileService } from '../file/file.service';
import { UserRole } from '../roles/entities/role.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

type IUploadedFiles = {
  images: UploadedFileMetadata[];
  image: UploadedFileMetadata;
};

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @RoleDecorator(UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 1 }, { name: 'images' }]),
  )
  async create(
    @UploadedFiles() { images, image }: IUploadedFiles,
    @Body() body,
    @UserDecorator() user,
  ): Promise<any> {
    return await this.productService.create(body, image[0], images);
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
