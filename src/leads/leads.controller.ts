import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { LeadCreateDto } from './dto/lead.create.dto';

@ApiTags('Заявки на ипотеку')
@Controller('leads')
export class LeadsController {
  @Inject()
  private readonly leadsService: LeadsService;

  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Вывести по id' })
  @Get("/:id")
  async getOne(@Param('id') id: number) {
    return await this.leadsService.getOne(id)
  }

  @ApiOperation({ summary: 'Вывести все' })
  @Get("/")
  async getAll() {
    return await this.leadsService.getAll()
  }

  @ApiOperation({ summary: 'Создать заявку' })
  @ApiBody({
    type: LeadCreateDto,
  })
  @Post("/")
  async createOne(@Body() data) {
    return await this.leadsService.setOne(data)
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Отредактировать по id' })
  @ApiBody({
    type: LeadCreateDto
  })
  @Patch('/:id')
  async updateOne(@Body() data, @Param('id') id: number) {
    return await this.leadsService.updateOne(data, id)
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Удалить по id' })
  @Delete('/:id')
  async deleteOne(@Param('id') id: number) {
    return await this.leadsService.deleteOne(id)
  }
}
