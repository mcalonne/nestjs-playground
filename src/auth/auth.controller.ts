import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Guards, services
import { AuthGuard } from '../shared/auth.guard';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

// DTOs
import RegisterDto from './dtos/register.dto';

// Constants
import * as Constants from './auth.constants';
import JwtContentDto, { USER_ROLE } from './dtos/jwt-content.dto';
import { ConfigService } from '@nestjs/config';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  private async getUserIdFromJwt(request: Request) {
    const jwtCookie = request.cookies[Constants.COOKIE_JWT_NAME];
    const { id: userId } = await this.authService.getJwtContent(jwtCookie);
    return userId;
  }

  @Post(['/register', '/admin/register'])
  async register(@Body() body: RegisterDto, @Req() request: Request) {
    const { password_confirmation, ...data } = body;

    if (body.password !== password_confirmation) {
      return new BadRequestException('Passwords does not match');
    }

    const hashedPassword = await this.authService.hashPassword(data.password);
    const createdUser = await this.userService.save({
      ...data,
      password: hashedPassword,
      is_admin: request.path === '/api/admin/register',
    });
    this.logger.debug(
      `[register][email=${data.email}] user has been successfully created`,
    );
    return createdUser;
  }

  @Post('/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await this.authService.checkPassword(password, user.password))) {
      throw new BadRequestException('Credentials are not valid');
    }

    const jwtContent: JwtContentDto = {
      id: user.id,
      role: user.is_admin ? USER_ROLE.ADMIN : USER_ROLE.USER,
    };
    const generatedJwt = await this.authService.generateJwt(jwtContent);
    response.cookie(Constants.COOKIE_JWT_NAME, generatedJwt, {
      httpOnly: true,
    });
    this.logger.log(`[userId=${user.id}] user has been successfully logged in`);

    return {
      message: 'successfully logged in',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/users')
  async getUser(@Req() request: Request) {
    const userId = await this.getUserIdFromJwt(request);
    const userData = await this.userService.findUserById(userId);
    this.logger.log(`[userId=${userId}] user has been successfully retrieved`);
    return userData;
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(Constants.COOKIE_JWT_NAME);
    this.logger.log(`user has been successfully logout`);
    return {
      message: 'successfully logout',
    };
  }

  @UseGuards(AuthGuard)
  @Put('/users/info')
  async updateUser(
    @Req() request: Request,
    @Body('first_name') firstName: string,
    @Body('last_name') lastName: string,
    @Body('email') email: string,
  ) {
    const userId = await this.getUserIdFromJwt(request);
    await this.userService.update(userId, {
      first_name: firstName,
      last_name: lastName,
      email,
    });
    this.logger.log(`[userId=${userId}] user has been successfully updated`);
    return this.userService.findUserById(userId);
  }

  @UseGuards(AuthGuard)
  @Put('users/password')
  async updatePassword(
    @Req() request: Request,
    @Body('password') password: string,
    @Body('password_confirmation') passwordConfirmation: string,
  ) {
    if (password !== passwordConfirmation) {
      return new BadRequestException('Passwords does not match');
    }
    const userId = await this.getUserIdFromJwt(request);
    await this.userService.update(userId, {
      password: await this.authService.hashPassword(password),
    });
    this.logger.log(
      `[userId=${userId}] user password has been successfully updated`,
    );
    return this.userService.findUserById(userId);
  }
}
