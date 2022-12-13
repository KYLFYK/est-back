import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { CountryGetResponseDto } from './dto/country.get.dto';

@ApiTags('Страны')
@Controller('country')
export class CountryController {
  @Inject()
  private readonly countryService: CountryService;

  @Get()
  @ApiOperation({ summary: 'Вывести все страны' })
  @ApiResponse({ status: HttpStatus.OK, type: [CountryGetResponseDto] })
  async get(): Promise<CountryGetResponseDto[]> {
    return this.countryService.findAll();
  }

}
