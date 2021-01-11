import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/roles/entities/role.entity';

export class LoginUserDto {
  @ApiProperty({ description: 'User name' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  readonly password: string;

  readonly roles: Role[];
}
