import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BadRequestException, NotFoundException, Body, Controller, HttpStatus, Inject, Post, Put, Delete, Get, Param, Query } from '@nestjs/common';

/* interfaces section */
import { IGuide } from './interfaces/guide.interface';
/* */

/* services section */
import { GuideService } from './guide.service';
/* */

/* decorators section */
import { Roles } from '../account/decorators/roles';
/* */

/* types section */
import { TRole } from '../account/types/role';
import { TType_en } from './types/type';
import { TFor } from './types/for';
/* */

/* dto section */
import { GuideGetResponseDto } from './dto/guide.get.dto';
import { GuidePostBodyDto, GuidePostResponseDto } from './dto/guide.post.dto';
import { GuidePutBodyDto, GuidePutResponseDto } from './dto/guide.put.dto';
import { GuideEntity } from './entities/guide.entity';
/* */

@ApiTags('Справочник')
@Controller('guide')
export class GuideController {

  @Inject()
  private readonly guideService: GuideService;

  /* READ */
  @Get()
  @ApiOperation({ summary: 'Вывести справочник' })
  @ApiQuery({ name: 'type', enum: TType_en, required: false })
  @ApiQuery({ name: 'for', enum: TFor, required: false })
  @ApiResponse({ status: HttpStatus.OK, type: GuideGetResponseDto })
  async get(@Query() data: {type: TType_en; for: TFor}): Promise<GuideEntity[]> {

    if (!data.type && !data.for) {
      return this.guideService.getAll();
    }

    else if (data.type && data.for) {
      
      if (!TType_en[data.type]) {
        throw new NotFoundException(`Type = '${data.type}' not found`);
      }
      if (!TFor[data.for]) {
        throw new NotFoundException(`Object = '${data.for}' not found`);
      }

      return this.guideService.getByTypeByFor(data.type, data.for);
      
    }

    else if (data.type) {
      if (!TType_en[data.type]) {
        throw new NotFoundException(`Type = '${data.type}' not found`);
      }

      return this.guideService.getByType(data.type);
    }

    else if (data.for) {
      if (!TFor[data.for]) {
        throw new NotFoundException(`Object = '${data.for}' not found`);
      }
      return this.guideService.getByFor(data.for);
    }

  }
  /* */

  /* CREATE */
  @ApiBearerAuth()
  @Roles(TRole.admin)
  @Post()
  @ApiOperation({ summary: 'Добавить' })
  @ApiResponse({ status: HttpStatus.OK, type: GuidePostResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async post(@Body() data: GuidePostBodyDto): Promise<GuidePostResponseDto> {
    if (Object.keys(data.for).length === 0) {
      throw new BadRequestException('\'for\' can\'t be empty');
    }
    data.for = [...new Set(data.for)]; //delete possible duplicate elements from array

    return plainToClass(GuidePostResponseDto, this.guideService.create(data));
  }
  /* */

  /* UPDATE */
  @ApiBearerAuth()
  @Roles(TRole.admin)
  @Put('/:id')
  @ApiOperation({ summary: 'Изменить по id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: GuidePutResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async put(@Param() id: IGuide['id'], @Body() data: GuidePutBodyDto): Promise<GuidePutResponseDto> {
    if (Object.keys(data.for).length === 0) {
      throw new BadRequestException('\'for\' can\'t be empty');
    }

    const find = await this.guideService.findOne(id['id']);

    if (!find) {
      throw new NotFoundException(`Id = ${id['id']} not found`);
    }
    data.for = [...new Set(data.for)]; //delete possible duplicate elements from array

    return plainToClass(GuidePutResponseDto, this.guideService.update(find, data));
  }
  /* */

  /* DELETE */
  @ApiBearerAuth()
  @Roles(TRole.admin)
  @Delete('/:id')
  @ApiOperation({ summary: 'Удалить по id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async delete(@Param() id: IGuide['id']): Promise<any> {

    const find = await this.guideService.findOne(id['id']);

    if (!find) {
      throw new NotFoundException(`Id = ${id['id']} not found`);
    }

    await this.guideService.delete(id['id']);

    return { status: 'success' };
  }
  /* */

}
