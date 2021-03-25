import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Req,
  Response,
  Session,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { Status } from './interfaces/verify-status.interface';
import { Public } from '../common/decorators/public.decorator';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Public()
  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );
    if (!result.success) {
      this.logger.log({
        message: result.message,
        level: 'error',
        label: 'register',
      });
      this.logger.log({ message: result.message, level: 'info' });
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    this.logger.debug(result.message);
    return result;
  }

  @Public()
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  @Public()
  @Get('verify/:hash')
  public async veriry(@Param() params, @Response() res): Promise<Status> {
    await this.authService.verify(params.hash);
    return res.redirect('/auth/user');
  }

  @Public()
  @Post('reset/')
  public async reset(@Body() data): Promise<Status> {
    return await this.authService.resetConfirm(data);
  }

  @Public()
  @Post('restore')
  public async restore(@Body() payload: ResetPasswordDto): Promise<any> {
    return await this.authService.resetPassword(payload);
  }

  @Get('user')
  public async testAuth(@Req() req: any): Promise<JwtPayload> {
    return req.user;
  }
}
