import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpStatus, Inject, NotFoundException, Param, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccountService } from "../../account/account.service";
import { CurrentAccount } from "../../account/decorators/currentAccount";
import { Roles } from "../../account/decorators/roles";
import { AccountGetResponseDto } from "../../account/dto/account.get.dto";
import { IAccount } from "../../account/interfaces/account.interface";
import { TRole } from "../../account/types/role";
import { CustomerPutBodyDto } from "../dto/customer/customer.put.dto";
import { CustomerService } from "../services/customer.service";

@ApiTags('Собственники')
@Controller('customer')
export class CustomerController {

  @Inject()
  private readonly accountService: AccountService;

  @Inject()
  private readonly customerService: CustomerService;

  @Get('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Получить информацию о собственнике по идентификатору' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountGetResponseDto })
  async getOne(@Param() id: IAccount['id']): Promise<AccountGetResponseDto> {
    const item = await this.accountService.findOne(id);

    if (!item) {
      throw new NotFoundException('Account not found');
    }
    if (item.role !== TRole.customer){
      throw new BadRequestException('У этого аккаунта роль не собственник')
    }

    return item;
  }

  @Get()
  @ApiOperation({ summary: 'Вывести всех собственников' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountGetResponseDto })
  async getAll(): Promise<AccountGetResponseDto[]> {
    return this.accountService.findByRole(TRole.customer);
  }

  /* UPDATE */
  @Put('/:accountId')
  @ApiOperation({ summary: 'Изменить информацию о собственнике' })
  @ApiBearerAuth()
  @Roles(TRole.admin, TRole.customer)
  @ApiBody({ type: CustomerPutBodyDto })
  @ApiQuery({ name: 'accountId', example: 1 })
  @ApiResponse({ status: HttpStatus.OK })
  async put(
    @CurrentAccount() currentAccount: IAccount,
    @Body() body: CustomerPutBodyDto,
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

    if (account.role !== TRole.customer){
      throw new BadRequestException (`accountId = ${data.accountId} isn't customer`)
    }

    const customer = await this.customerService.findOne(account.customerProperty.id)

    return this.customerService.update(customer, body)
  }
  /* */

}
