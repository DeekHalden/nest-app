import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { isRgbColor } from 'class-validator';
import { Repository } from 'typeorm';
import { Role, UserRole } from '../roles/entities/role.entity';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({});

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Role),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
  it('should return array of users', async () => {
    const user: UserDto = {
      email: 'test@test.com',
      id: 1,
      roles: [{ title: UserRole.ADMIN, id: 1 }],
    };
    const result = [user];
    jest
      .spyOn(usersService, 'findAll')
      .mockImplementation(async (): Promise<UserDto[]> => result);
    expect(await controller.findAll()).toBe(result);
  });
});
