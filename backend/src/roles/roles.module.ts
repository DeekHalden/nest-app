import { Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role, UserRole } from './entities/role.entity';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {
  constructor(
    @InjectRepository(Role) private userRoleRepository: Repository<Role>,
  ) {}
}
