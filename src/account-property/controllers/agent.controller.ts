import {
  Controller,
  Inject,
  Get,
  HttpStatus,
  Query,
  BadRequestException,
  Put,
  Body,
  ForbiddenException,
  Patch, Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AccountService } from "../../account/account.service";
import { CurrentAccount } from "../../account/decorators/currentAccount";
import { Roles } from "../../account/decorators/roles";
import { AccountGetResponseDto } from "../../account/dto/account.get.dto";
import { IAccount } from "../../account/interfaces/account.interface";
import { TRole } from "../../account/types/role";
import { AgentPutBodyDto } from "../dto/agent/agent.put.dto";
import { AgentService } from "../services/agent.service";

@ApiTags('Агенты')
@Controller('agent')
export class AgentController {
  @Inject()
  private readonly accountService: AccountService;

  @Inject()
  private readonly agentService: AgentService;

  @Get('our')
  @ApiOperation({ summary: 'Наши агенты' })
  @ApiQuery({ name: 'amount', type: Number})
  @ApiResponse({ status: HttpStatus.OK, type: AccountGetResponseDto })
  async getOur(@Query() data: {amount: number}): Promise<AccountGetResponseDto[]> {
    if (!data.amount){
      throw new BadRequestException(`amount query must exist`)
    }
    if (Number(data.amount) <= 0 || isNaN(Number(data.amount))){
      throw new BadRequestException(`amount must be more 0`)
    }
    return this.accountService.findByRole(TRole.agent, data.amount);
  }

  @Get()
  @ApiOperation({ summary: 'Вывести всех агентов' })
  @ApiResponse({ status: HttpStatus.OK, type: AccountGetResponseDto })
  async getAll(): Promise<AccountGetResponseDto[]> {
    return this.accountService.findByRole(TRole.agent);
  }

  /* UPDATE */
  @Patch('/:accountId')
  @ApiOperation({ summary: 'Изменить информацию об агенте' })
  @ApiBearerAuth()
  @Roles(TRole.admin, TRole.agent)
  @ApiBody({ type: AgentPutBodyDto })
  @ApiParam({ name: 'accountId', type: Number })
  @ApiResponse({ status: HttpStatus.OK })
  async put(
    @CurrentAccount() currentAccount: IAccount,
    @Body() body: AgentPutBodyDto,
    @Param() accountId: number
  ){
    if (!accountId){
      throw new BadRequestException (`accountId query must not be empty.`)
    }
    const account = await this.accountService.findOne(accountId['accountId']);


    if (!account){
      throw new BadRequestException (`accountId = ${accountId} was not found.`)
    }

    if (account.role !== TRole.admin){
      if (account.id !== currentAccount.id){
        throw new ForbiddenException('access denied');
      }
    }

    if (account.role !== TRole.agent){
      throw new BadRequestException (`accountId = ${accountId} isn't agent.`)
    }

    const agent = await this.agentService.findOne(account.agentProperty.id)

    return this.agentService.update(agent, body)
  }
  /* */

}
