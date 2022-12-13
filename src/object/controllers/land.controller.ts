import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BadRequestException, ForbiddenException, NotFoundException, Body, Controller, HttpStatus, Inject, Post, Put, Patch, Delete, Get, Param, Query } from '@nestjs/common';
import { ILand } from '../interfaces/land/land.interface';
import { IAccount } from '../../account/interfaces/account.interface';
import { LandService } from '../services/land.service';
import { Roles } from '../../account/decorators/roles';
import { CurrentAccount } from '../../account/decorators/currentAccount';
import { TRole } from '../../account/types/role';
import { LandResponseDto } from '../dto/land/land.response.dto';
import { LandBodyDto } from '../dto/land/land.body.dto';
import { BaseObjectService } from '../services/baseObject.service';
import { Mapper } from '../../common/utils/mapper';

@ApiTags('Участок')
@Controller('land')
export class LandController {

  @Inject()
  private readonly landService: LandService;

  @Inject()
  private readonly baseObjectService: BaseObjectService;

  /* READ */
  @Get()
  @ApiOperation({ summary: 'Вывести все' })
  @ApiQuery({ name: 'take', required: false, example: 10 })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiResponse({ status: HttpStatus.OK, type: LandResponseDto })
  async getAll(@Query() data: {take: number; skip: number}): Promise<LandResponseDto[]> {
    return this.landService.findAll(data.take, data.skip);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Вывести по id' })
  @ApiParam({ name: 'id', type: Number })
  //@ApiResponse({ status: HttpStatus.OK, type: LandResponseDto })
  async getOne(
    @Param() id: ILand['id'],
    @CurrentAccount() account: IAccount,
  ): Promise<any>{//LandResponseDto> {

    const land = await this.landService.findOne(id['id']);

    if (!land) {
      throw new NotFoundException(`id = ${id['id']} not found`);
    }
    if (land.markAsDelete){
      throw new BadRequestException('this object has been deleted')
    }
    const result = plainToClass(LandResponseDto, land);
    result['currentAccount'] = account;
    await this.baseObjectService.incrementViews(land, 'land')
    return Mapper.convert('land', result);
  }
  /* */

  /* CREATE */
  @Post()
  @ApiBearerAuth()
  @ApiBody({
    type: LandBodyDto
  })
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin)
  @ApiOperation({ summary: 'Добавить' })
  @ApiResponse({ status: HttpStatus.CREATED, type: LandResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.FORBIDDEN })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async post(@Body() data): Promise<LandResponseDto> {
    return this.landService.create(data);
  }
  /* */

  /* UPDATE */
  @Patch('/:id')
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Пометить на удаление по id' })
  @ApiResponse({ status: HttpStatus.OK, type: LandResponseDto })
  async mark(@CurrentAccount() account: IAccount, @Param() id: ILand['id']): Promise<LandResponseDto> {
    const land = await this.landService.findOne(id['id']);

    if (!land) {
      throw new NotFoundException('land not found');
    }

    if (account.role !== TRole.admin){
      if (land.owner){
        if (land.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }

    return this.landService.mark(land, true);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin)
  @ApiOperation({ summary: 'Изменить по id' })
  @ApiParam({ name: 'id', type: Number })
  async put(
    @CurrentAccount() account: IAccount,
    @Param() id: ILand['id'],
    @Body() data: LandBodyDto
  ): Promise<LandResponseDto> {

    const land = await this.landService.findOne(id['id']);

    if (!land) {
      throw new NotFoundException('land not found');
    }

    if (account.role !== TRole.admin){
      if (land.owner){
        if (land.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }

    return this.landService.update(land, data);
  }

  /* DELETE */
  @Delete('/:id')
  @ApiBearerAuth()
  @Roles(TRole.admin)
  @ApiOperation({ summary: 'Удалить по id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async delete(@Param() id: ILand['id']): Promise<any> {

    await this.landService.delete(id['id']);

    return { status: 'success' };
  }
  /* */

}
