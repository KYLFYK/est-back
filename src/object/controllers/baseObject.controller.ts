import { Controller, Get, Query, Param, BadRequestException, Inject } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { CurrentAccount } from "../../account/decorators/currentAccount";
import { Roles } from "../../account/decorators/roles";
import { IAccount } from "../../account/interfaces/account.interface";
import { TRole } from "../../account/types/role";
import { BaseObjectService } from "../services/baseObject.service";

@ApiTags('Объекты')
@Controller('objects')
export class BaseObjectController {

  @Inject()
  private readonly baseObjectService: BaseObjectService;

  @Get('/owner/:owner')
  @ApiOperation({ summary: 'Вывести объекты по owner' })
  @ApiParam({ name: 'owner', type: Number })
  @ApiQuery({ name: 'take', example: 10 })
  @ApiQuery({ name: 'skip', example: 0 })
  async getObjectsByOwner(@Query() data: {take: number; skip: number}, @Param() owner: IAccount['id']){
    if (data.take <= 0){
      throw new BadRequestException ('take must be more 0')
    }
    if (data.skip < 0){
      throw new BadRequestException ('take must be more or equal 0')
    }
    return this.baseObjectService.getObjectsByOwner(owner['owner'], data.take, data.skip)
  }

  @Get('/best-offers')
  @ApiOperation({ summary: 'Вывести лучшие объекты' })
  @ApiQuery({ name: 'take', required: true, example: 3 })
  @ApiQuery({ name: 'isApartment', example: true, type: Boolean })
  @ApiQuery({ name: 'isHouse', example: true, type: Boolean })
  @ApiQuery({ name: 'isComplex', example: true, type: Boolean })
  @ApiQuery({ name: 'isNew', example: true, type: Boolean })
  @ApiQuery({ name: 'isOld', example: true, type: Boolean })
  @ApiQuery({ name: 'city', example: 1, type: Number, required:false })
  async getRandomObjects2(
    @Query() data: {
      take: number,
      isApartment: string,
      isHouse: string,
      isComplex: string,
      isNew: string,
      isOld: string,
      city?: number
    }
  ){
    if (data.take > 10){
      throw new BadRequestException ('Max 10 objects')
    }

    return this.baseObjectService.getBestOffers(
      data.take,
      data.isApartment === 'true',
      data.isHouse === 'true',
      data.isComplex === 'true',
      data.isNew === 'true',
      data.isOld === 'true',
      data.city
    )
  }

  @Get('/favorites')
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiOperation({ summary: 'Вывести избранные объекты у текущего пользователя' })
  async getFavoriteObjects(@CurrentAccount() account: IAccount){
    return this.baseObjectService.getFavoriteObjects(account.id)
  }

  @Get('/in')
  @ApiQuery({
    name: 'longitude',
    required: true
  })
  @ApiQuery({
    name: 'latitude',
    required: true
  })
  async getObjectIn(@Query() data: {
    longitude: number,
    latitude: number
  }) {
    return await this.baseObjectService.getObjectInRadius(data.longitude, data.latitude)
  }
}
