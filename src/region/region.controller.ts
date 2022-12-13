import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegionGetResponseDto } from './dto/region.get.dto';
import { RegionService } from './region.service';
import { RegionCreateDto } from './dto/region.create.dto';
import { IApartment } from '../object/interfaces/apartment/apartment.interface';
import { IRegion } from './interfaces/region.interface';

@ApiTags('Регионы')
@Controller('region')
export class RegionController {

  @Inject()
  private readonly regionService: RegionService;

  @Get()
  @ApiOperation({ summary: 'Вывести все регионы' })
  @ApiResponse({ status: HttpStatus.OK, type: [RegionGetResponseDto] })
  async get(): Promise<RegionGetResponseDto[]> {
    return this.regionService.findAll();
  }

  @ApiOperation({summary: 'Добавить регион'})
  @Post("/")
  @ApiResponse({ status: HttpStatus.OK, type: RegionGetResponseDto})
  async create(@Body() data: RegionCreateDto): Promise<RegionGetResponseDto> {
    console.log(data)
    return await this.regionService.create(data)
  }

  @Patch('/:id')
  @ApiOperation({summary: 'Обновить регион'})
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: RegionGetResponseDto})
  async update(@Param() id: IRegion['id'], @Body() data: RegionCreateDto): Promise<RegionGetResponseDto> {
    const foundData = await this.regionService.findOne(id)
    if(!foundData) {
      throw new NotFoundException('Region is not found')
    }

    return await this.regionService.update(foundData, data)
  }
}
