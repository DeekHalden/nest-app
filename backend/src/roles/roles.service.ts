import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private userRoleRepository: Repository<Role>,
  ) {}

  async getUserRoles(userId: number): Promise<Role[]> {
    return await this.userRoleRepository.find({
      join: { alias: 'roles', innerJoin: { users: 'roles.users' } },
      where: (qb) => {
        qb.andWhere('user.id = :userId', { id: userId });
      },
      // where: {
      //   userId,
      // },
      // relations: ['users'],
    });
  }
}
