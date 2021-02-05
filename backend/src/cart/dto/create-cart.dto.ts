import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { CreateCartItemDto } from './create-cart-item.dto';

export class CreateCartDto {
  @ApiProperty({ description: 'Array of products' })
  @ValidateNested({ each: true })
  @Type(() => CreateCartItemDto)
  product: CreateCartItemDto;
}

export class CreateCartWithUserDto extends CreateCartDto {
  @ApiProperty({ description: 'User id' })
  @IsNumber()
  user: any;
}
