import { Body, Controller, Get, HttpStatus, Inject, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CityService } from './city.service';
import { CityGetResponseDto } from './dto/city.get.dto';
import { RegionGetResponseDto } from '../region/dto/region.get.dto';
import { RegionCreateDto } from '../region/dto/region.create.dto';
import { IRegion } from '../region/interfaces/region.interface';
import { CityCreateDto } from './dto/city.body.dto';

@ApiTags('Города')
@Controller('city')
export class CityController {
  @Inject()
  private readonly cityService: CityService;

  @Get()
  @ApiOperation({ summary: 'Вывести все города' })
  @ApiResponse({ status: HttpStatus.OK, type: [CityGetResponseDto] })
  async get(): Promise<CityGetResponseDto[]> {
    return this.cityService.findAll();
  }

  @ApiOperation({summary: 'Добавить город'})
  @Post("/")
  @ApiResponse({ status: HttpStatus.OK, type: CityGetResponseDto})
  async create(@Body() data: CityCreateDto): Promise<CityGetResponseDto> {
    return await this.cityService.create(data)
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({summary: 'Обновить регион'})
  @ApiResponse({ status: HttpStatus.OK, type: CityGetResponseDto})
  async update(@Param() id: IRegion['id'], @Body() data: CityCreateDto): Promise<CityGetResponseDto> {
    const foundData = await this.cityService.findOne(id)
    if(!foundData) {
      throw new NotFoundException('Region is not found')
    }

    return await this.cityService.update(foundData, data)
  }

}
