import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Smart search')

@Controller('search')
export class SearchController {
  @Inject()
  private readonly searchService: SearchService;

  @Get('/')
  @ApiQuery({
    name: 'order-type',
    enum: ['sale', 'buy', 'rent'],
    required: true
  })
  @ApiQuery({
    name: 'object-type',
    enum: ['townhouse', 'apartment', 'land', 'house'],
    description: 'Вид объекта',
    required: true
  })
  @ApiQuery({
    name: 'rooms-in-apartment',
    enum: ['studio', 'one', 'two', 'three', 'four', 'five', 'six', 'free_plan'],
    isArray:true,
    description: 'Комнат в квартире',
    required: false
  })
  @ApiQuery({
    name: 'rooms-in-house',
    enum: ['one', 'two', 'three', 'four', 'five', 'six', 'more_then_six'],
    isArray:true,
    description: 'Комнат в доме',
    required: false
  })
  @ApiQuery({
    name: 'benefit',
    description: 'Благоустройства на земельном участке',
    enum: ['electric','gas', 'water', 'canalization'],
    isArray: true,
    required: false
  })
  @ApiQuery({
    name: 'building',
    type: Boolean,
    description: 'Здания на земельном участке',
    required: false
  })
  @ApiQuery({
    name: 'price-from',
    type: Number,
    required: false
  })
  @ApiQuery({
    name: 'price-to',
    type: Number,
    required: false
  })
  @ApiQuery({
    name: 'square-from',
    type: Number,
    required: false
  })
  @ApiQuery({
    name: 'square-to',
    type: Number,
    required: false
  })
  @ApiQuery({
    name: 'building-type',
    enum: ['new', 'old'],
    description: 'Тип здания',
    required: true,
  })
  @ApiQuery({
    name: 'floor',
    type: Number,
    description: 'Этаж',
    required: false,
  })

  @ApiQuery({
    name: 'city',
    type: Number,
    description: 'Идентификатор города из справочника',
    required: false
  })
  async search(
    @Query() data: {
      'order-type': string,
      'object-type': string,
      'rooms': string[],
      'price-from': number,
      'price-to': number,
      'square-from': number,
      'square-to': number,
      'building-type': string,
      'floor': number,
      'benefit': string[],
      'building': boolean
    }
  ) {
    return await this.searchService.search(data);
  }
}
