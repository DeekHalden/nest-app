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

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @RoleDecorator(UserRole.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.userService.findAll();
  }
}
