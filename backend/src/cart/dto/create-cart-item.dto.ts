import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({ description: 'Product id' })
  @IsNumber()
  productId: any;

  @ApiProperty({ description: 'Product quantity' })
  @IsNumber()
  quantity: number;
}
