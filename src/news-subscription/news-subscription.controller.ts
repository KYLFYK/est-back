import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { NotFoundException, Body, Controller, HttpStatus, Inject, Post, Get, Param, Query, Delete, Put } from '@nestjs/common';
import { NewsSubscriptionGetResponseDto, NewsSubscriptionGetResponseByObjectDto } from './dto/news-subscription.get.dto';
import { INewsSubscription } from './interfaces/news-subscription.interface';
import { NewsSubscriptionService } from './news-subscription.service';
import { TFor } from '../guide/types/for';
import { NewsSubscriptionPostBodyDto } from './dto/news-subscription.post.dto';
import { BaseIdDto } from '../common/dto/base.dto';
import { NewsSubscriptionPutBodyDto } from './dto/news-subscription.put.dto';

@ApiTags('Подписка на новости')
@Controller('news-subscription')

export class NewsSubscriptionController {

    @Inject()
    private readonly newsSubscriptionService: NewsSubscriptionService;

    /* READ */
    @Get('/:id')
    @ApiOperation({ summary: 'Вывести по id' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: HttpStatus.OK, type: NewsSubscriptionGetResponseDto })
    async getOne(@Param() id: INewsSubscription['id']): Promise<NewsSubscriptionGetResponseDto> {
      const subscription = await this.newsSubscriptionService.findOne(id['id']);
      if (!subscription){
        throw new NotFoundException (`id = ${id['id']} wasn't found`)
      }
      return subscription
    }
    /*
    @Get()
    @ApiOperation({ summary: 'Вывести по object' })
    @ApiQuery({ name: 'objectType', enum: TFor, example: TFor.apartment })
    @ApiQuery({ name: 'objectId', example: 1, type: Number })
    @ApiResponse({ status: HttpStatus.OK, type: NewsSubscriptionGetResponseByObjectDto })
    async getByObject(@Query() data: {objectType: TFor; objectId: number}): Promise<NewsSubscriptionGetResponseDto[]> {
        
        if (!data.objectType) {
            throw new NotFoundException(`objectType is not defined`);
        }

        if (!TFor[data.objectType]){
            throw new NotFoundException(`objectType must be one of ${Object.values(TFor)}`);
        }

        if (isNaN(Number(data.objectId))){
            throw new NotFoundException(`objectId must be more or equal 1`);
        }
        
        if (!data.objectId || data.objectId == 0) {
            throw new NotFoundException(`objectId must be more or equal 1`);
        }

        const setObjects = await this.baseObjectService.getSetObjectsByObjectIdByObjectType(data.objectId, TFor[data.objectType])
        if (!setObjects){
          throw new NotFoundException(`objectId = ${data.objectId} for entity ${data.objectType} doesn't exist`);
        }

        const result = await this.newsSubscriptionService.findByObject(setObjects.id);

        if (result.length === 0){
            throw new NotFoundException(`News subscription don't exist for this object`);
        }
        
        for (const r of result){
            delete r.object    
        }

        return result
    }
    */
    /* */

    /* CREATE */
    @Post()
    @ApiOperation({ summary: 'Добавить подписку' })
    @ApiResponse({ status: HttpStatus.OK, type: BaseIdDto })
    async post(@Body() body: NewsSubscriptionPostBodyDto): Promise<BaseIdDto>{
      return this.newsSubscriptionService.create(body)
    }
    /* */

    /* UPDATE
    @Put('/:id')
    @ApiOperation({ summary: 'Изменить по id' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: HttpStatus.OK, type: NewsSubscriptionPutBodyDto })
    async update(@Param() id: INewsSubscription['id'], @Body() data: NewsSubscriptionPutBodyDto):Promise<NewsSubscriptionGetResponseDto>{
        const find = await this.newsSubscriptionService.findOne(id['id']);
        
        if (!find) {
          throw new NotFoundException(`id = ${id['id']} doesn't exist`);
        }

        const update = await this.newsSubscriptionService.update(find, data);

        return update
    }
    /* */

    /* DELETE */
    @Delete('/:id')
    @ApiOperation({ summary: 'Удалить по id' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: HttpStatus.OK, type: BaseIdDto })
    async delete(@Param() id: INewsSubscription['id']): Promise<BaseIdDto> {
        
      const newsSubscription = await this.newsSubscriptionService.findOne(id['id'])

      if (!newsSubscription){
        throw new NotFoundException(`id = ${id['id']} not found`);
      }

      await this.newsSubscriptionService.delete(id['id'])
      return {id: id['id']}
    }
    /* */
}
