import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BadRequestException, Body, Controller, HttpStatus, Inject, Post, Patch, Get, Param, Query, NotFoundException } from '@nestjs/common';

/* interfaces section */
import { IAuth } from './interfaces/auth.interface';
import { IAccount } from '../account/interfaces/account.interface';
/* */

/* dto section */
import { AuthCreateBodyDto, AuthCreateResponseDto } from './dto/auth.create.dto';
import { AuthLoginBodyDto, AuthLoginResponseDto } from './dto/auth.login.dto';
import { AuthRefreshBodyDto, AuthRefreshResponseDto } from './dto/auth.refresh.dto';
import { AuthCheckBodyDto, AuthCheckResponseDto } from './dto/auth.check.dto';
import { AuthMeResponseDto } from './dto/auth.me.dto';
import { AuthResetBodyDto, AuthResetResponseDto, AuthResetLinkResponseDto } from './dto/auth.reset.dto';
/* */

/* services section */
import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
/* */

/* decorators section */
import { CurrentAccount } from '../account/decorators/currentAccount';
import { Roles } from '../account/decorators/roles';
/* */

/* types section */
import { TRole } from '../account/types/role';
import { AuthConfirmResponseDto } from './dto/auth.confirm.dto';
/* */

@ApiTags('Авторизация/Регистрация')
@Controller('auth')
export class AuthController {

  @Inject()
  private readonly authService: AuthService;

  @Inject()
  private readonly accountService: AccountService;

  @ApiOperation({ summary: 'Регистрация (отправить письмо на почту)' })
  @Post('/register')
  @ApiResponse({ status: HttpStatus.OK, type: AuthCreateResponseDto })
  async register(@Body() body: AuthCreateBodyDto): Promise<AuthCreateResponseDto> {
    const found = await this.accountService.findByEmail(body.publicKey);

    if (found) {
      throw new BadRequestException('Account already exists');
    }

    const auth = await this.authService.register(
      body.publicKey,
      body.privateKey,
      body.phone,
      body.name,
      body.role
    );

    return plainToClass(AuthCreateResponseDto, auth);
  };

  @ApiOperation({ summary: 'Авторизация по логину и коду' })
  @Post('/login')
  @ApiResponse({ status: HttpStatus.OK, type: AuthLoginResponseDto })
  async login(@Body() body: AuthLoginBodyDto): Promise<AuthLoginResponseDto> {
    return this.authService.login(body.publicKey, body.privateKey);
  }

  @ApiOperation({ summary: 'Пересоздать токен' })
  @Post('/refresh')
  @ApiResponse({ status: HttpStatus.OK, type: AuthRefreshResponseDto })
  async refresh(@Body() body: AuthRefreshBodyDto): Promise<AuthRefreshResponseDto> {
    return this.authService.refreshToken(body.token);
  }

  @ApiOperation({ summary: 'Проверка токена' })
  @Post('/check')
  @ApiResponse({ status: HttpStatus.OK, type: AuthCheckResponseDto })
  async check(@Body() body: AuthCheckBodyDto): Promise<AuthCheckResponseDto> {
    return {
      isActive: await this.authService.checkToken(body.token),
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Вывод информации по текущему авторизованному пользователю' })
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @Get('/me')
  @ApiResponse({ status: HttpStatus.OK, type: AuthMeResponseDto })
  async me(@CurrentAccount() account: IAccount): Promise<AuthMeResponseDto> {
    return account;
  }

  @ApiOperation({ summary: 'Отправить письмо на сброс пароля' })
  @Post('/reset-password')
  @ApiResponse({ status: HttpStatus.OK, type: AuthResetResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async resetPost(@Body() body: AuthResetBodyDto): Promise<AuthResetResponseDto> {
    return {
      email: await this.authService.reset(body.email, '/api/auth/reset-password'),
    };
  }

  @ApiOperation({ summary: 'Сменить пароль' })
  @Patch('/change-password')
  @ApiQuery({ name: 'token', type: String })
  @ApiQuery({ name: 'accountId', type: Number })
  @ApiQuery({ name: 'newPassword', type: String })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.FORBIDDEN })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async changePassword(@Query() data: { token: string; accountId: IAccount['id']; newPassword: IAuth['privateKey'] }): Promise<any> {
    await this.authService.changePassword(data.token, data.accountId, data.newPassword);

    return { status: 'success' };
  }

  @Patch('/confirm-email/:token')
  @ApiParam({ name: 'token', type: String })
  @ApiOperation({ summary: 'Подтвердить почту' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthConfirmResponseDto })
  async confirm(@Param() token: string): Promise<AuthConfirmResponseDto> {
    if (!await this.authService.checkToken(token['token'])) {
      throw new BadRequestException('Token is not valid');
    }
    const accountToken = await this.authService.decode(token['token'])

    if (!accountToken) {
      throw new NotFoundException('Account is not found');
    }
    if (!accountToken.id) {
      throw new NotFoundException('Account is not found');
    }

    const account = await this.accountService.findOne(accountToken.id)
    await this.accountService.confirm(account, true)
    return { success: true }
  }

}
