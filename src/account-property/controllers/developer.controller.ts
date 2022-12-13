import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccountService } from "../../account/account.service";
import { CurrentAccount } from "../../account/decorators/currentAccount";
import { Roles } from "../../account/decorators/roles";
import { AccountGetResponseDto } from "../../account/dto/account.get.dto";
import { IAccount } from "../../account/interfaces/account.interface";
import { TRole } from "../../account/types/role";
import { DeveloperPutBodyDto, DeveloperPutResponseDto } from "../dto/developer/developer.put.dto";
import { DeveloperService } from "../services/developer.service";

@ApiTags('Застройщики')
@Controller('developer')
export class DeveloperController {

  @Inject()
  private readonly accountService: AccountService;

  @Inject()
  private readonly developerService: DeveloperService;

  @Get('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Получить информацию о застройщике по идентификатору' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountGetResponseDto })
  async getOne(@Param() id: IAccount['id']): Promise<AccountGetResponseDto> {
    const item = await this.accountService.findOne(id);

    if (!item) {
      throw new NotFoundException('Account not found');
    }
    if (item.role !== TRole.developer){
      throw new BadRequestException('This account is not developer')
    }

    return item;
  }

  @Get('/get/our')
  @ApiQuery({ name: 'amount', type: Number})
  @ApiOperation({ summary: 'Наши застройщики' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountGetResponseDto })
  async getOur(@Query() data: {amount: number}): Promise<AccountGetResponseDto[]> {
    if (!data.amount){
      throw new BadRequestException(`amount query must exist`)
    }
    if (Number(data.amount) <= 0 || isNaN(Number(data.amount))){
      throw new BadRequestException(`amount must be more 0`)
    }
    return this.accountService.findByRole(TRole.developer, data.amount);
  }

  @Get()
  @ApiOperation({ summary: 'Вывести всех застройщиков' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountGetResponseDto })
  async getAll(): Promise<AccountGetResponseDto[]> {
    return this.accountService.findByRole(TRole.developer);
  }

  /* UPDATE */
  @Patch('/:accountId')
  @ApiOperation({ summary: 'Изменить информацию о застройщике' })
  @ApiBearerAuth()
  @Roles(TRole.admin, TRole.developer)
  @ApiBody({ type: DeveloperPutBodyDto })
  @ApiQuery({ name: 'accountId', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, type: DeveloperPutResponseDto })
  async put(
    @CurrentAccount() currentAccount: IAccount,
    @Body() body: DeveloperPutBodyDto,
    @Query() data: {accountId: number}
  ){
    if (!data.accountId){
      throw new BadRequestException (`accountId query must not be empty.`)
    }

    const account = await this.accountService.findOne(data.accountId);

    if (!account){
      throw new BadRequestException (`accountId = ${data.accountId} was not found.`)
    }

    if (currentAccount.role !== TRole.admin){
      if (account.id !== currentAccount.id){
        throw new ForbiddenException('access denied');
      }
    }

    if (account.role !== TRole.developer){
      throw new BadRequestException (`accountId = ${data.accountId} isn't developer.`)
    }

    const developer = await this.developerService.findOne(account.developerProperty.id)

    return this.developerService.update(developer, body)
  }
  /* */

}
