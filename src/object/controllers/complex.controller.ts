import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import {
  ForbiddenException,
  NotFoundException,
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Put,
  Patch,
  Delete,
  Get,
  Param,
  Query,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { IComplex } from '../interfaces/complex/complex.interface';
import { IAccount } from '../../account/interfaces/account.interface';
import { ComplexService } from '../services/complex.service';
import { Roles } from '../../account/decorators/roles';
import { CurrentAccount } from '../../account/decorators/currentAccount';
import { TRole } from '../../account/types/role';
import { ComplexGetOneResponseDto, ComplexResponseDto } from '../dto/complex/complex.response.dto';
import { ComplexBodyDto } from '../dto/complex/complex.body.dto';
import { BaseObjectService } from '../services/baseObject.service';
import { ApartmentService } from '../services/apartment.service';
import { Mapper } from '../../common/utils/mapper';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileInterceptorOptions } from '../../common/const/FileInterceptorOptions';
import { ComplexEntity } from '../entities/complex.entity';

@ApiTags('Жилой комплекс')
@Controller('complex')
export class ComplexController {

  @Inject()
  private readonly complexService: ComplexService;

  @Inject()
  private readonly apartmentService: ApartmentService;

  @Inject()
  private readonly baseObjectService: BaseObjectService;

  /* READ */
  @Get()
  @ApiOperation({ summary: 'Вывести все ЖК' })
  @ApiQuery({ name: 'take', required: false, example: 10 })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiResponse({ status: HttpStatus.OK, type: [ComplexResponseDto] })
  async getAll(@Query() data: {take: number; skip: number}): Promise<ComplexEntity[]> {
    return await this.complexService.findAll(data.take, data.skip)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Вывести ЖК по id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  //@ApiResponse({ status: HttpStatus.OK, type: ComplexGetOneResponseDto })
  async getOne(
    @Param() id: IComplex['id'],
    @CurrentAccount() account: IAccount,
  ): Promise<any> {

    let result: ComplexGetOneResponseDto;

    // find main data for complex
    const complex = plainToClass(ComplexGetOneResponseDto, await this.complexService.findOne(id['id']));

    if (!complex) {
      throw new NotFoundException(`id = ${id['id']} not found`);
    }
    if (complex.markAsDelete){
      throw new BadRequestException('this object has been deleted')
    }
    result = plainToClass(ComplexGetOneResponseDto, complex);

    // find planning list
    result.planningList = await this.complexService.findPlanningByComplex(complex.id);
    result['currentAccount'] = account;
    await this.baseObjectService.incrementViews(complex, 'complex')
    return Mapper.convert('complex', result);
  }

  @Get('/getByOwner/:ownerId')
  @ApiOperation({ summary: 'Вывести ЖК по owner' })
  @ApiParam({ name: 'ownerId', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [ComplexResponseDto] })
  async getByOwner(@Param() ownerId: IComplex['owner']): Promise<ComplexResponseDto[]> {
    return this.complexService.findByOwner(ownerId['ownerId']);
  }
  /* */

  /* CREATE */
  @Post()
  @ApiBody({ type: ComplexBodyDto })
  @UseInterceptors(FilesInterceptor('files', 50, FileInterceptorOptions))
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiOperation({ summary: 'Добавить ЖК' })
  @ApiResponse({ status: HttpStatus.OK, type: ComplexResponseDto })
  async post(@Body() data): Promise<ComplexResponseDto> {
    return this.complexService.create(data);
  }
  /* */

  /* UPDATE */
  @Delete('/:id')
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Пометить на удаление по id' })
  @ApiResponse({ status: HttpStatus.OK, type: ComplexResponseDto })
  async mark(@CurrentAccount() account: IAccount, @Param() id: IComplex['id']): Promise<ComplexResponseDto> {
    const complex = await this.complexService.findOne(id['id']);

    if (!complex) {
      throw new NotFoundException('complex not found');
    }

    if (account.role !== TRole.admin){
      if (complex.owner){
        if (complex.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }

    return this.complexService.mark(complex, true);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @ApiOperation({ summary: 'Изменить по id' })
  @ApiParam({ name: 'id', type: Number })
  async put(
    @CurrentAccount() account: IAccount,
    @Param() id: IComplex['id'],
    @Body() data: ComplexBodyDto
  ): Promise<ComplexResponseDto> {

    const complex = await this.complexService.findOne(id['id']);

    if (!complex) {
      throw new NotFoundException('complex not found');
    }

    if (account.role !== TRole.admin){
      if (complex.owner){
        if (complex.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }

    return this.complexService.update(complex, data);
  }

}
