import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/roles/entities/role.entity';

export class LoginUserDto {
  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  readonly password: string;

  readonly roles?: Role[];
}
