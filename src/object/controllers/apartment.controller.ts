import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { NotFoundException, Body, Controller, HttpStatus, Inject, Post, Put, Patch, Delete, Get, Param, Query, UploadedFile, UseInterceptors, UploadedFiles, ForbiddenException, BadRequestException } from '@nestjs/common';
import { IApartment } from '../interfaces/apartment/apartment.interface';
import { IAccount } from '../../account/interfaces/account.interface';
import { ApartmentService } from '../services/apartment.service';
import { Roles } from '../../account/decorators/roles';
import { CurrentAccount } from '../../account/decorators/currentAccount';
import { TRole } from '../../account/types/role';
import { ApartmentResponseDto } from '../dto/apartment/apartment.response.dto';
import { ApartmentBodyDto } from '../dto/apartment/apartment.body.dto';
import { BaseObjectService } from '../services/baseObject.service';
import { Mapper } from '../../common/utils/mapper';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileInterceptorOptions } from '../../common/const/FileInterceptorOptions';

@ApiTags('Квартира')
@Controller('apartment')
export class ApartmentController {

  @Inject()
  private readonly apartmentService: ApartmentService;

  @Inject()
  private readonly baseObjectService: BaseObjectService;

  /* READ */
  @Get()
  @ApiOperation({ summary: 'Вывести все' })
  @ApiQuery({ name: 'take', required: false, example: 10 })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiResponse({ status: HttpStatus.OK, type: [ApartmentResponseDto] })
  async getAll(@Query() data: {take: number; skip: number}): Promise<any> {
    const appartment = await this.apartmentService.findAll(data.take, data.skip);
    // return plainToClass(ApartmentResponseDto, appartment);
    return appartment;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Вывести по id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  async getOne(
    @Param() id: IApartment['id'],
    @CurrentAccount() account: IAccount,
  ): Promise<any>{

    const apartment = await this.apartmentService.findOne(id['id']);

    if (!apartment) {
      throw new NotFoundException(`id = ${id['id']} not found`);
    }
    if (apartment.markAsDelete){
      throw new BadRequestException('this object has been deleted')
    }

    const result = plainToClass(ApartmentResponseDto, apartment);

    result['currentAccount'] = account;
    await this.baseObjectService.incrementViews(apartment, 'apartment')
    return Mapper.convert('apartment', result);
  }

  @Get('/getByComplex/:complexId')
  @ApiOperation({ summary: 'Вывести по ЖК' })
  @ApiParam({ name: 'complexId', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [ApartmentResponseDto] })
  async getByComplex(@Param() complexId: IApartment['complex']): Promise<ApartmentResponseDto[]> {

    const apartments = await this.apartmentService.findByComplex(complexId['complexId']);

    if (apartments.length === 0) {
      throw new NotFoundException(`apartments for complexId = ${complexId['complexId']} were not found`);
    }
    return apartments
  }
  /* */

  /* CREATE */
  @Post()
  @ApiBody({ type: ApartmentBodyDto })
  @UseInterceptors(FilesInterceptor('files', 50, FileInterceptorOptions))
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiOperation({ summary: 'Добавить' })
  @ApiResponse({ status: HttpStatus.OK, type: ApartmentResponseDto })
  async post(@Body() data): Promise<ApartmentResponseDto> {
    return this.apartmentService.create(data)
  }
  /* */

  /* UPDATE */
  @Put('/:id')
  @ApiBearerAuth()
  // @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiOperation({ summary: 'Изменить по id' })
  @ApiParam({ name: 'id', type: Number })
  async put(
    @CurrentAccount() account: IAccount,
    @Param() id: IApartment['id'],
    @Body() data: ApartmentBodyDto
  ): Promise<any> {

    const apartment = await this.apartmentService.findOne(id['id']);

    if (!apartment) {
      throw new NotFoundException('apartment not found');
    }

    if (account.role !== TRole.admin){
      if (apartment.owner){
        if (apartment.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }
    // console.log(apartment);
    // console.log(data);
    return this.apartmentService.update(apartment, data);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Пометить на удаление по id' })
  @ApiResponse({ status: HttpStatus.OK, type: ApartmentResponseDto })
  async mark(
    @CurrentAccount() account: IAccount,
    @Param() id: IApartment['id']
  ): Promise<ApartmentResponseDto> {
    const apartment = await this.apartmentService.findOne(id['id']);

    if (!apartment) {
      throw new NotFoundException('apartment not found');
    }

    if (account.role !== TRole.admin){
      if (apartment.owner){
        if (apartment.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }

    return this.apartmentService.mark(apartment, true);

  }
  /* */

}
