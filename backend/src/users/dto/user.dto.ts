import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/roles/entities/role.entity';

export class UserDto {
  @ApiProperty({ description: 'User id' })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  readonly roles: Role[];
}
