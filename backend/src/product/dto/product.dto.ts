import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { File } from 'src/file/entities/file.entity';

export class ProductDto {
  @ApiProperty({ description: 'Product title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Product creation time' })
  @IsString()
  createdAt: string;

  @ApiProperty({ description: 'Product update time' })
  @IsString()
  updatedAt: string;

  @ApiProperty({ description: 'Product image url' })
  @IsString()
  image: File;

  @ApiProperty({ description: 'Product price' })
  @IsString()
  price: string;
}
