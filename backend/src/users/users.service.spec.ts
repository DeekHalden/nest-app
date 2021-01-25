import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { comparePasswords, hashPassword, User } from './entities/user.entity';
import { Role } from './../roles/entities/role.entity';
import { Repository, Connection } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { toUserDto } from '../shared/mapper';
import { MockRepository } from '../shared/mock-repository';

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: Connection,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Role),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of all users', async () => {
      const expectedUsersList = [];
      userRepository.find.mockReturnValue(expectedUsersList);
      const users = await service.findAll();
      expect(users).toEqual(expectedUsersList);
    });
  });

  describe('create', () => {
    describe("when user doesn't exist", () => {
      it('should return user', async () => {
        const createUserDto: CreateUserDto = {
          email: 'deekhalden@gmail.com',
          password: '1988dik1',
        };
        const expectedUser = {};
        userRepository.create.mockReturnValue(expectedUser);
        const user: UserDto = await service.create(createUserDto);
        expect(user).toEqual(expectedUser);
      });
    });
    describe('otherwise', () => {
      it('should throw new "BadRequestException"', async () => {
        const createUserDto: CreateUserDto = {
          email: 'deekhalden@gmail.com',
          password: '1988dik1',
        };
        try {
          userRepository.findOne = jest.fn(() => createUserDto.email);
          expect(await service.create(createUserDto)).rejects.toThrow();
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.message).toEqual(`User already exists`);
        }
      });
    });
  });

  describe('findByLogin', () => {
    describe('if user exists', () => {
      describe('and passwords match', () => {
        it('should return user', async () => {
          const loginUserDto: LoginUserDto = {
            email: 'deekhalden@gmail.com',
            password: '43431q11',
          };
          const userInDb = {
            email: 'deekhalden@gmail.com',
            password: await hashPassword('43431q11'),
            id: 1,
            roles: [
              {
                title: 'admin',
                id: 1,
              },
            ],
          };
          userRepository.findOne.mockReturnValue(userInDb);
          const user = await service.findByLogin(loginUserDto);
          expect(user).toEqual(toUserDto(userInDb as User));
        });
      });
      describe('otherwise', () => {
        it('should throw "UnauthorizedException"', async () => {
          const loginUserDto: LoginUserDto = {
            email: 'deekhalden@gmail.com',
            password: '1245678',
          };
          const userInDb = {
            email: 'deekhalden@gmail.com',
            password: await hashPassword('43431q11'),
            id: 1,
            roles: [
              {
                title: 'admin',
                id: 1,
              },
            ],
          };
          try {
            userRepository.findOne.mockReturnValue(userInDb);
            await service.findByLogin(loginUserDto);
            await comparePasswords(loginUserDto.password, userInDb.password);
          } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.message).toEqual('User not found');
          }
        });
      });
    });
    describe('if user not exists ', () => {
      it('should throw "UnauthorizedException"', async () => {
        try {
          await service.findByLogin({ email: 'blah', password: '12345566' });
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toEqual('User not found');
        }
      });
    });
  });

  describe('findByPayload', () => {
    describe('if user exists ', () => {
      it('should return user', async () => {
        const sampleUser = {
          email: 'deekhalden@gmail.com',
          password: await hashPassword('43431q11'),
          id: 1,
          roles: [
            {
              title: 'admin',
              id: 1,
            },
          ],
        };
        const expectedUser = {};
        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.findByPayload({ email: sampleUser.email });
        expect(user).toEqual(expectedUser);
      });
    });
    describe('otherwise', () => {
      it('should throw "UnauthorizedException"', async () => {
        try {
          const email = 'd@e.fm';
          userRepository.findOne = jest.fn(() => null);
          expect(await service.findByPayload({ email })).rejects.toThrow();
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toEqual('User not found');
        }
      });
    });
  });

  describe('findById', () => {
    describe('if user found', () => {
      it('should return user', async () => {
        const userId = 1;
        const expectedUser = {};
        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.findById(userId);
        expect(user).toEqual(expectedUser);
      });
    });
    describe('otherwise', () => {
      it('should throw "UnauthorizedException"', async () => {
        const userId = 1231234;
        userRepository.findOne.mockReturnValue(null);
        try {
          await service.findById(userId);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toEqual('User not found');
        }
      });
    });
  });

  describe('patch', () => {
    it('should return updated user', async () => {
      const data = {
        id: 1,
        password: 'test@test.com',
      };
      const expectedUser = {};
      userRepository.update.mockReturnValue(expectedUser);
      const user = await service.patch(data.id, { password: data.password });
      expect(user).toEqual(expectedUser);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const id = '1';
      const expectedUser = undefined;
      userRepository.delete.mockReturnValue(expectedUser);
      const result = await service.remove(id);
      expect(result).toEqual(expectedUser);
    });
  });
});
