import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { Verify } from '../users/entities/verify.entity';
import { ResetPassword } from '../users/entities/reset-password.entity';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';

import { EmailerModule } from '../mailer/emailer.module';
import { EmailerService } from '../mailer/emailer.service';
import { PassportModule } from '@nestjs/passport';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({});

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let emailerService: MailerService;
  let jwtService: JwtService;

  let verifyRepository: MockRepository;
  let resetRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule/* , EmailerModule, PassportModule, JwtModule */,
      ],
      providers: [
        AuthService,
        MailerService,
        {
          provide: Connection,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Verify),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(ResetPassword),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // userService = module.get<UsersService>(UsersService);
    // emailerService = module.get<MailerService>(MailerService);
    // jwtService = module.get<JwtService>(JwtService);
    verifyRepository = module.get<MockRepository>(getRepositoryToken(Verify));
    resetRepository = module.get<MockRepository>(
      getRepositoryToken(ResetPassword),
    );
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
    // // expect(userService).toBeDefined();
    // // expect(emailerService).toBeDefined();
    // // expect(jwtService).toBeDefined();
    // expect(verifyRepository).toBeDefined();
    // expect(resetRepository).toBeDefined();
  });
});
