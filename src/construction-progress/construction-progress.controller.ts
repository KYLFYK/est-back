import { Body, Controller, Delete, Get, HttpStatus, Inject, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../account/decorators/roles';
import { TRole } from '../account/types/role';
import { BaseIdDto } from '../common/dto/base.dto';
import { IComplex } from '../object/interfaces/complex/complex.interface';
import { ConstructionProgressService } from './construction-progress.service';
import { ConstructionProgressGetResponseDto } from './dto/construction-progress.get.dto';
import { ConstructionProgressPostBodyDto } from './dto/construction-progress.post.dto';
import { ConstructionProgressPutBodyDto } from './dto/construction-progress.put.dto';
import { IConstructionProgress } from './interfaces/construction-progress.interface';

@ApiTags('Ход строительства')
@Controller('construction-progress')
export class ConstructionProgressController {

  @Inject()
  private constructionProgressService: ConstructionProgressService;

  /* READ */
  @Get('/:id')
  @ApiOperation({ summary: 'Вывести по id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ConstructionProgressGetResponseDto })
  async getById(@Param() id: IConstructionProgress['id']): Promise<ConstructionProgressGetResponseDto> {

    const result = await this.constructionProgressService.findOne(id['id']);

    if (!result) {
      throw new NotFoundException('There is no data')
    }
    return result
  }
  /* */

  /* CREATE */
  @Post()
  @ApiBearerAuth()
  @Roles(TRole.developer, TRole.admin)
  @ApiOperation({ summary: 'Добавить' })
  @ApiResponse({ status: HttpStatus.OK, type: ConstructionProgressGetResponseDto })
  async post(@Body() body: ConstructionProgressPostBodyDto): Promise<ConstructionProgressGetResponseDto> {
    return this.constructionProgressService.create(body)
  }
  /* */

  /* UPDATE */
  @Put('/:id')
  @ApiBearerAuth()
  @Roles(TRole.developer, TRole.admin)
  @ApiOperation({ summary: 'Изменить по id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ConstructionProgressGetResponseDto })
  async update(
    @Param() id: IConstructionProgress['id'],
    @Body() data: ConstructionProgressPutBodyDto
  ): Promise<ConstructionProgressGetResponseDto> {

    const find = await this.constructionProgressService.findOne(id['id']);

    if (!find) {
      throw new NotFoundException(`id = ${id['id']} not found`);
    }

    return this.constructionProgressService.update(find, data);
  }
  /* */

  /* DELETE */
  @Delete('/:id')
  @ApiOperation({ summary: 'Удалить по id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: BaseIdDto })
  async delete(@Param() id: IConstructionProgress['id']): Promise<BaseIdDto> {

    const constructionProgress = await this.constructionProgressService.findOne(id['id'])

    if (!constructionProgress) {
      throw new NotFoundException(`id = ${id['id']} not found`);
    }

    await this.constructionProgressService.delete(id['id'])
    return { id: id['id'] }
  }
  /* */
}
