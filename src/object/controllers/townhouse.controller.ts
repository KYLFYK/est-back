import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BadRequestException, ForbiddenException, NotFoundException, Body, Controller, HttpStatus, Inject, Post, Put, Patch, Delete, Get, Param, Query } from '@nestjs/common';
import { ITownhouse } from '../interfaces/townhouse/townhouse.interface';
import { IAccount } from '../../account/interfaces/account.interface';
import { TownhouseService } from '../services/townhouse.service';
import { Roles } from '../../account/decorators/roles';
import { CurrentAccount } from '../../account/decorators/currentAccount';
import { TRole } from '../../account/types/role';
import { TownhouseResponseDto } from '../dto/townhouse/townhouse.response.dto';
import { TownhouseBodyDto } from '../dto/townhouse/townhouse.body.dto';
import { BaseObjectService } from '../services/baseObject.service';
import { Mapper } from '../../common/utils/mapper';
import { HouseBodyDto } from '../dto/house/house.body.dto';
import { HouseResponseDto } from '../dto/house/house.response.dto';
import { HouseService } from '../services/house.service';

@ApiTags('Таунхаус')
@Controller('townhouse')
export class TownhouseController {
  @Inject()
  private readonly houseService: HouseService;

  @Inject()
  private readonly townhouseService: TownhouseService;
  
  @Inject()
  private readonly baseObjectService: BaseObjectService;

  /* READ
  @Get()
  @ApiOperation({ summary: 'Вывести все' })
  @ApiQuery({ name: 'take', required: false, example: 10 })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiResponse({ status: HttpStatus.OK, type: TownhouseResponseDto })
  async getAll(@Query() data: {take: number; skip: number}): Promise<TownhouseResponseDto> {
    return plainToClass(TownhouseResponseDto, this.townhouseService.findAll(data.take, data.skip));
  }
  */
  @Get('/:id')
  @ApiOperation({ summary: 'Вывести по id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  async getOne(
    @Param() id: ITownhouse['id'],
    @CurrentAccount() account: IAccount,
  ): Promise<any> {

    const townhouse = await this.townhouseService.findOne(id['id']);

    if (!townhouse) {
      throw new NotFoundException(`id = ${id['id']} not found`);
    }
    if (townhouse.markAsDelete){
      throw new BadRequestException('this object has been deleted')
    }
    const result = plainToClass(TownhouseResponseDto, townhouse);
    await this.baseObjectService.incrementViews(townhouse, 'townhouse')
    return Mapper.convert('house', result);
  }
  /*
  @Get('/getByComplex/:complexId')
  @ApiOperation({ summary: 'Вывести по ЖК' })
  @ApiParam({ name: 'complexId', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [TownhouseResponseDto] })
  async getByComplex(@Param() complexId: ITownhouse['complex']): Promise<TownhouseResponseDto[]> {
    
    const townhouses = await this.townhouseService.findByComplex(complexId['complexId']);

    if (townhouses.length === 0) {
      throw new NotFoundException(`townhouses for complexId = ${complexId['complexId']} were not found`);
    }
    return townhouses
  }  
  /* */

  /* CREATE */
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: HouseBodyDto })
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiOperation({ summary: 'Добавить' })
  async post(@Body() data): Promise<any> {
    return this.townhouseService.create(data);
  }
  /* */

  /* UPDATE */
  @Patch('/:id')
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Пометить на удаление по id' })
  @ApiResponse({ status: HttpStatus.OK, type: TownhouseResponseDto })
  async mark(@CurrentAccount() account: IAccount, @Param() id: ITownhouse['id']): Promise<TownhouseResponseDto> {
    const townhouse = await this.townhouseService.findOne(id['id']);

    if (!townhouse) {
      throw new NotFoundException('townhouse not found');
    }

    if (account.role !== TRole.admin){
      if (townhouse.owner){
        if (townhouse.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }

    return this.townhouseService.mark(townhouse, true);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiOperation({ summary: 'Изменить по id' })
  @ApiParam({ name: 'id', type: Number })
  async put(
    @CurrentAccount() account: IAccount,
    @Param() id: ITownhouse['id'],
    @Body() data: TownhouseBodyDto
  ): Promise<any> {

    const townhouse = await this.townhouseService.findOne(id['id']);

    if (!townhouse) {
      throw new NotFoundException('townhouse not found');
    }

    if (account.role !== TRole.admin){
      if (townhouse.owner){
        if (townhouse.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }

    return this.townhouseService.update(townhouse, data);
  }

  /* DELETE
  @Delete('/:id')
  @ApiBearerAuth()
  @Roles(TRole.admin)
  @ApiOperation({ summary: 'Удалить по id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async delete(@Param() id: ITownhouse['id']): Promise<any> {

    await this.townhouseService.delete(id['id']);

    return { status: 'success' };
  }
  /* */

}
