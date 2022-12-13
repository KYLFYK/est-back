import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BadRequestException, ForbiddenException, NotFoundException, Body, Controller, HttpStatus, Inject, Post, Put, Patch, Delete, Get, Param, Query } from '@nestjs/common';
import { IHouse } from '../interfaces/house/house.interface';
import { IAccount } from '../../account/interfaces/account.interface';
import { HouseService } from '../services/house.service';
import { Roles } from '../../account/decorators/roles';
import { CurrentAccount } from '../../account/decorators/currentAccount';
import { TRole } from '../../account/types/role';
import { HouseResponseDto } from '../dto/house/house.response.dto';
import { HouseBodyDto } from '../dto/house/house.body.dto';
import { BaseObjectService } from '../services/baseObject.service';
import { Mapper } from '../../common/utils/mapper';
import { TownhouseBodyDto } from '../dto/townhouse/townhouse.body.dto';

@ApiTags('Дом')
@Controller('house')
export class HouseController {

  @Inject()
  private readonly houseService: HouseService;

  @Inject()
  private readonly baseObjectService: BaseObjectService;

  /* READ */
  @Get()
  @ApiOperation({ summary: 'Вывести все' })
  @ApiQuery({ name: 'take', required: false, example: 10 })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiResponse({ status: HttpStatus.OK, type: HouseResponseDto })
  async getAll(@Query() data: { take: number; skip: number }): Promise<any> {
    const houses = await this.houseService.findAll(data.take, data.skip);
    return plainToClass(HouseResponseDto, houses);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Вывести по id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  async getOne(
    @Param() id: IHouse['id'],
    @CurrentAccount() account: IAccount,

  ): Promise<any> {//HouseResponseDto> {

    const house = await this.houseService.findOne(id['id']);

    if (!house) {
      throw new NotFoundException(`id = ${id['id']} not found`);
    }
    if (house.markAsDelete){
      throw new BadRequestException('this object has been deleted')
    }

    const result = plainToClass(HouseResponseDto, house);

    result['currentAccount'] = account;
    await this.baseObjectService.incrementViews(house, 'house')
    return Mapper.convert('house', result);
  }

  @Get('/getByComplex/:complexId')
  @ApiOperation({ summary: 'Вывести по ЖК' })
  @ApiParam({ name: 'complexId', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [HouseResponseDto] })
  async getByComplex(@Param() complexId: IHouse['complex']): Promise<HouseResponseDto[]> {

    const houses = await this.houseService.findByComplex(complexId['complexId']);

    if (houses.length === 0) {
      throw new NotFoundException(`houses for complexId = ${complexId['complexId']} were not found`);
    }
    return houses
  }

  @Get('/getByOwner/:ownerId')
  @ApiOperation({ summary: 'Вывести дома по owner' })
  @ApiParam({ name: 'ownerId', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [HouseResponseDto] })
  async getByOwner(@Param() ownerId: IHouse['owner']): Promise<HouseResponseDto[]> {
    return this.houseService.findByOwner(ownerId['ownerId']);
  }
  /* */

  /* CREATE */
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: TownhouseBodyDto })
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiOperation({ summary: 'Добавить' })
  @ApiResponse({ status: HttpStatus.OK, type: HouseResponseDto })
  async post(@Body() data): Promise<HouseResponseDto> {
    return this.houseService.create(data);
  }
  /* */

  /* UPDATE */
  @Patch('/:id')
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Пометить на удаление по id' })
  @ApiResponse({ status: HttpStatus.OK, type: HouseResponseDto })
  async mark(@CurrentAccount() account: IAccount, @Param() id: IHouse['id']): Promise<HouseResponseDto> {
    const house = await this.houseService.findOne(id['id']);

    if (!house) {
      throw new NotFoundException('house not found');
    }

    if (account.role !== TRole.admin) {
      if (house.owner) {
        if (house.owner.id !== account.id) {
          throw new ForbiddenException('access denied');
        }
      }
      else {
        throw new ForbiddenException('access denied');
      }
    }

    return this.houseService.mark(house, true);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiOperation({ summary: 'Изменить по id' })
  @ApiParam({ name: 'id', type: Number })
  async put(
    @CurrentAccount() account: IAccount,
    @Param() id: IHouse['id'],
    @Body() data: HouseBodyDto
  ): Promise<any> {

    const house = await this.houseService.findOne(id['id']);

    if (!house) {
      throw new NotFoundException('house not found');
    }

    if (account.role !== TRole.admin) {
      if (house.owner) {
        if (house.owner.id !== account.id) {
          throw new ForbiddenException('access denied');
        }
      }
      else {
        throw new ForbiddenException('access denied');
      }
    }

    return this.houseService.update(house, data);
  }

}
