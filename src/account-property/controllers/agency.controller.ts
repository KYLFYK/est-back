import { Controller, Inject, Get, HttpStatus, Query, BadRequestException, Put, Body, ForbiddenException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { AccountService } from "../../account/account.service";
import { CurrentAccount } from "../../account/decorators/currentAccount";
import { Roles } from "../../account/decorators/roles";
import { AccountGetResponseDto } from "../../account/dto/account.get.dto";
import { IAccount } from "../../account/interfaces/account.interface";
import { TRole } from "../../account/types/role";
import { AgencyPutBodyDto } from "../dto/agency/agency.put.dto";
import { AgencyService } from "../services/agency.service";

@ApiTags('Агенства')
@Controller('agency')
export class AgencyController {
  @Inject()
  private readonly accountService: AccountService;

  @Inject()
  private readonly agencyService: AgencyService;

  @Get()
  @ApiOperation({ summary: 'Вывести все агенства' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountGetResponseDto })
  async getAll(): Promise<AccountGetResponseDto[]> {
    return this.accountService.findByRole(TRole.agency);
  }

  /* UPDATE */
  @Put('/:accountId')
  @ApiOperation({ summary: 'Изменить информацию об агенстве' })
  @ApiBearerAuth()
  @Roles(TRole.admin, TRole.agency)
  @ApiBody({ type: AgencyPutBodyDto })
  @ApiQuery({ name: 'accountId', example: 1 })
  @ApiResponse({ status: HttpStatus.OK })
  async put(
    @CurrentAccount() currentAccount: IAccount,
    @Body() body: AgencyPutBodyDto,
    @Query() data: {accountId: number}
  ){
    if (!data.accountId){
      throw new BadRequestException (`accountId query must not be empty.`)
    }

    const account = await this.accountService.findOne(data.accountId);

    if (!account){
      throw new BadRequestException (`accountId = ${data.accountId} was not found.`)
    }
    
    if (account.role !== TRole.admin){
      if (account.id !== currentAccount.id){
        throw new ForbiddenException('access denied');
      }
    }

    if (account.role !== TRole.agency){
      throw new BadRequestException (`accountId = ${data.accountId} isn't agency.`)
    }

    const agency = await this.agencyService.findOne(account.agencyProperty.id)

    return this.agencyService.update(agency, body)
  }
  /* */

}