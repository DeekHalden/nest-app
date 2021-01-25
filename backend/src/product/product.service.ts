import {
  AzureStorageService,
  UploadedFileMetadata,
} from '@nestjs/azure-storage';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { Connection, Repository, UpdateResult } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product.dto';
import { Product } from './entities/product.entity';
import { Event } from '../events/entities/event.entity';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly azureStorage: AzureStorageService,
    private readonly fileService: FileService,
    private readonly connection: Connection,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    image: UploadedFileMetadata,
    images: UploadedFileMetadata[],
  ): Promise<any> {
    const unitInDb = await this.productRepository.findOne({
      where: { title: createProductDto.title },
    });
    if (unitInDb) {
      throw new HttpException(
        'Product with such name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let product;
    try {
      product = await this.productRepository.create(createProductDto);
      const imagesProxy: UploadedFileMetadata[] = [image, ...images].map(
        (image: UploadedFileMetadata) => {
          image = {
            ...image,
            originalname: `${uuidv4()}_${image.originalname}`,
          };
          return image;
        },
      );
      const imagesUrls: string[] = await Promise.all(
        imagesProxy.map(async (image) => await this.azureStorage.upload(image)),
      );

      const [imageId, ...imagesIds] = await Promise.all(
        imagesUrls.map(
          async (url: string, index: number) =>
            await this.fileService.create({
              url,
              name: imagesProxy[index].originalname,
            }),
        ),
      );
      product.image = imageId.id;
      product.images = imagesIds.map(({ id }) => ({ id }));

      const savedProduct = await queryRunner.manager.save(product);

      const createImageEvent = new Event();
      createImageEvent.name = 'create_product_image';
      createImageEvent.type = 'product';
      createImageEvent.payload = { productId: savedProduct.id };

      const createImagesEvent = new Event();
      createImagesEvent.name = 'create_product_images';
      createImagesEvent.type = 'product';
      createImagesEvent.payload = { productId: savedProduct.id };

      await queryRunner.manager.save(createImageEvent);
      await queryRunner.manager.save(createImagesEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return product;
  }

  async findAll(query?: any): Promise<Product[]> {
    return await this.productRepository.find({ relations: query.relations });
  }

  async findOne(payload: any): Promise<ProductDto> {
    const product = await this.productRepository.findOne({
      where: { payload },
    });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async remove(id: number): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['image', 'images'],
    });

    if (!product) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const imagesId = [
      ...product.images.map((image) => image.id),
      product.image.id,
    ];

    await Promise.all(
      imagesId.map(async (id) => await this.fileService.remove(id)),
    );
    await this.productRepository.delete(id);
    return {
      data: {
        title: 'Product removed successfully',
      },
    };
  }

  async patch(id: number, data: any): Promise<UpdateResult> {
    const item = await this.productRepository.update(id, data);
    if (!item) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return item;
  }
}
