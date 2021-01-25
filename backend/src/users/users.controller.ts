import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { UserRole } from '../roles/entities/role.entity';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { VerifiedDecorator } from 'src/common/decorators/verified.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @RoleDecorator(UserRole.ADMIN)
  @VerifiedDecorator(true)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(): Promise<UserDto[]> {
    return await this.userService.findAll();
  }
}
