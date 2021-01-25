import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ description: 'File url' })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ description: 'File name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
