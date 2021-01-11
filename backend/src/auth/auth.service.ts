import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { getUserRedirect } from '../shared/redirect';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Verify } from '../users/intities/verify.entity';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { Status } from './interfaces/verify-status.interface';
import { ResetPassword } from 'src/users/intities/reset-password.entity';
import { ResetPasswordDto } from 'src/users/dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailerService: MailerService,
    @InjectRepository(Verify) private verifyRepository: Repository<Verify>,
    @InjectRepository(ResetPassword)
    private resetRepository: Repository<ResetPassword>,
  ) {}

  async _generateHash(
    email: string,
    userId: number,
    repo: Repository<Verify> | Repository<ResetPassword>,
  ): Promise<string> {
    const generatedHash = createHash('sha256').update(email).digest('hex');
    const hash = await repo.create({
      id: generatedHash,
      userId,
    });

    await this.verifyRepository.save(hash);
    return generatedHash;
  }

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'User registered',
    };
    try {
      const user = await this.usersService.create(userDto);
      const generatedHash = await this._generateHash(
        user.email,
        user.id,
        this.verifyRepository,
      );
      await this.emailerService.sendMail({
        to: userDto.email,
        from: process.env.DEFAULT_FROM,
        subject: 'Registration notification',
        text: 'Welcome message',
        html: `<a href='http://localhost:3000/auth/verify/${generatedHash}'>verification link</a>`,
      });
    } catch (error) {
      status = {
        success: false,
        message: error,
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.usersService.findByLogin(loginUserDto, ['roles']);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const token = this._generateToken(user);
    const redirect = getUserRedirect(user);
    return {
      username: user.username,
      ...token,
      redirect,
    };
  }

  async verify(id: string): Promise<Status> {
    const status: Status = {
      status: 'verified',
    };

    const hash = await this.verifyRepository.findOne(id);

    if (!hash) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.usersService.patch(hash.userId, { isActive: true });
    await this.verifyRepository.remove(hash);
    return status;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<Status> {
    const user = await this.usersService.findByPayload(resetPasswordDto);
    const status: Status = {
      status: 'reset',
    };
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const generatedHash = await this._generateHash(
      resetPasswordDto.email,
      user.id,
      this.resetRepository,
    );
    await this.emailerService.sendMail({
      to: resetPasswordDto.email,
      from: process.env.DEFAULT_FROM,
      subject: 'Reset password notification',
      text: 'Reset password message',
      html: `<a href='http://localhost:3000/auth/restore/${generatedHash}'>verification link</a>`,
    });
    return status;
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload, ['roles']);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _generateToken({ username }: UserDto): any {
    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRES_IN,
      accessToken,
    };
  }
}
