import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserRole } from '../roles/entities/role.entity';
import { toUserDto } from '../shared/mapper';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDto } from './dto/user.dto';
import { comparePasswords, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private userRoleRepository: Repository<Role>,
  ) {}

  findAll(): Promise<UserDto[]> {
    return this.userRepository.find({
      relations: ['roles'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { password, email } = createUserDto;
    const userInDb = await this.userRepository.findOne({
      where: { email },
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user: User = await this.userRepository.create({
      password,
      email,
      roles: await this.preloadRole(),
    });
    await this.userRepository.save(user);
    return toUserDto(user);
  }

  private async preloadRole(
    titles: string[] = [UserRole.ADMIN],
  ): Promise<Role[]> {
    const role = await Promise.all(
      titles.map(async (title) => {
        return await this.userRoleRepository.findOne({
          where: { title },
        });
      }),
    );
    return role;
  }

  async findByLogin(
    { email, password }: LoginUserDto,
    relations?: string[],
  ): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const areEqual = await comparePasswords(password, user.password);

    if (!areEqual) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return toUserDto(user);
  }

  async findByPayload(payload: any, relations?: any): Promise<UserDto> {
    const user: UserDto = await this.userRepository.findOne({
      where: payload,
      relations,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async findById(id: number, relations?: string[]): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async patch(id: number, data: any): Promise<UpdateResult> {
    const user = await this.userRepository.update(id, data);
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
