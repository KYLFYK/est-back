import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IAccount } from './interfaces/account.interface';
import { AccountGetResponseDto } from './dto/account.get.dto';
import {
  AccountChangeBodyDto,
  AccountChangeResponseDto,
  AccountChangeRoleResponseDto,
  AccountMarkResponseDto,
} from './dto/account.change.dto';
import { AccountService } from './account.service';
import { Roles } from '../account/decorators/roles';
import { TRole } from './types/role';
import { find } from 'rxjs';

@ApiTags('Аккаунты')
@Controller('account')
export class AccountController {
  @Inject()
  private readonly accountService: AccountService;

  @Get('/find-by-email/:email')
  // @Roles(TRole.admin, TRole.agent, TRole.developer, TRole.customer, TRole.bank)
  @ApiParam({ name: 'email', type: String })
  @ApiOperation({ summary: 'Получить информацию об аккаунте по идентификатору' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountGetResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async findByPartEmail(@Param() data: string): Promise<AccountGetResponseDto[]> {
    return await this.accountService.findByPartEmail(data['email']);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @Roles(TRole.admin, TRole.agent, TRole.developer, TRole.customer, TRole.bank)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Получить информацию об аккаунте по идентификатору' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountGetResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getOne(@Param() id: IAccount['id']): Promise<AccountGetResponseDto> {
    const item = await this.accountService.findOne(id);

    if (!item) {
      throw new NotFoundException('Account not found');
    }

    return item;
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Roles(TRole.admin, TRole.agent, TRole.developer, TRole.customer, TRole.bank)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Изменить аккаунт по идентификатору' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountChangeResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async change(@Param() id: IAccount['id'], @Body() updateData: AccountChangeBodyDto): Promise<AccountChangeResponseDto> {

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('The Body has no properties');
    }
    const findAccount = await this.accountService.findOne(id);

    if (!findAccount) {
      throw new NotFoundException('Account not found');
    }

    const update = await this.accountService.update(findAccount, updateData);

    return plainToClass(AccountChangeResponseDto, update);

  }

  @Patch('/change-role/:id')
  @ApiBearerAuth()
  @Roles(TRole.admin)
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'role', enum: TRole })
  @ApiOperation({ summary: 'Смена роли пользователя' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountChangeRoleResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async changeRole(@Param() id: IAccount['id'], @Query('role') role: TRole): Promise<AccountChangeRoleResponseDto> {

    const findAccount = await this.accountService.findOne(id);

    if (!findAccount) {
      throw new NotFoundException('Account not found');
    }

    const update = await this.accountService.updateRole(findAccount, role);

    return plainToClass(AccountChangeRoleResponseDto, update);

  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Roles(TRole.admin)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Пометить на удаление по идентификатору' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountMarkResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async mark(@Param() id: IAccount['id']): Promise<AccountMarkResponseDto> {

    const findAccount = await this.accountService.findOne(id);

    if (!findAccount) {
      throw new NotFoundException('Account not found');
    }

    const update = await this.accountService.mark(findAccount, true);

    return plainToClass(AccountMarkResponseDto, update);
  }

  @Get('users/new')
  @ApiBearerAuth()
  @Roles(TRole.admin)
  @ApiQuery({ name: 'dateFrom', required: true, type: Date, example: '2022-02-12' })
  @ApiQuery({ name: 'dateTo', required: true, type: Date, example: '2022-02-14' })
  @ApiOperation({ summary: 'Получить информацию по регистрации новых пользователей' })
  @ApiResponse({ status: HttpStatus.OK })
  async getNewUsers(@Query() data: {dateFrom: Date; dateTo: Date}): Promise<any> {
    if (!data.dateFrom){
      throw new BadRequestException('query dateFrom must be exist')
    }
    if (!data.dateTo){
      throw new BadRequestException('query dateTo must be exist')
    }

    data.dateFrom = new Date(data.dateFrom)
    if (data.dateFrom.toString() === 'Invalid Date'){
      throw new BadRequestException('dateFrom must be date format. Example: 2022-02-14')
    }

    data.dateTo = new Date(data.dateTo)
    if (data.dateTo.toString() === 'Invalid Date'){
      throw new BadRequestException('dateTo must be date format. Example: 2022-02-11')
    }

    if (new Date(data.dateFrom) > new Date(data.dateTo)){
      throw new BadRequestException('dateTo must be more or equal than dateFrom')
    }

    return this.accountService.findNewUsers(data.dateFrom, data.dateTo);
  }
}
