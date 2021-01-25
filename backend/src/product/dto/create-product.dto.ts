import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IsNull } from 'typeorm';
import { File } from '../../file/entities/file.entity';

export class CreateProductDto {
  @ApiProperty({ description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ description: 'Product image url' })
  @IsNotEmpty()
  readonly image: any;

  @ApiProperty({ description: 'Product price' })
  @IsString()
  @IsNotEmpty()
  readonly price: string;

  @ApiProperty({ description: 'Product images urls' })
  @IsArray()
  readonly images: any[];
}
