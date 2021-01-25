import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFileDto } from './create-file.dto';

export class FileDto extends PartialType(CreateFileDto) {
  @ApiProperty({ description: 'File id'})
  id: number;
}
