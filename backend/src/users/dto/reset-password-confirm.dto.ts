import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordConfirmationDto {
  @ApiProperty({ description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(20, { message: 'The max length of password is 20' })
  readonly password: string;

  @ApiProperty({ description: 'Password confirmation' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(20, { message: 'The max length of password is 20' })
  readonly passwordConfirmation: string;

  @ApiProperty({ description: 'Hash' })
  @IsNotEmpty()
  @IsString()
  readonly hash: string;
}
