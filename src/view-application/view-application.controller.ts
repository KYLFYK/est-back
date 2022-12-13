import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ForbiddenException, NotFoundException, Body, Controller, HttpStatus, Inject, Post, Get, Param, Query, Patch } from '@nestjs/common';
import { GuideService } from '../guide/guide.service';
import { BaseObjectService } from '../object/services/baseObject.service';
import { ViewApplicationService } from './view-application.service';
import { IAccount } from '../account/interfaces/account.interface';
import { IViewApplication } from './interfaces/view-application.interface';
import { ViewApplicationGetResponseDto } from './dto/view-application.get.dto';
import { ViewApplicationPostBodyDto, ViewApplicationPostResponseDto } from './dto/view-application.post.dto';
import { TFor } from '../guide/types/for';
import { TType_en } from '../guide/types/type';
import { TRole } from '../account/types/role';
import { GuideEntity } from '../guide/entities/guide.entity';
import { Roles } from '../account/decorators/roles';
import { CurrentAccount } from '../account/decorators/currentAccount';

@ApiTags('Заявки на просмотр')
@Controller('view-application')
export class ViewApplicationController {

  @Inject()
  private readonly guideService: GuideService;

  @Inject()
  private readonly baseObjectService: BaseObjectService;

  @Inject()
  private readonly viewApplicationService: ViewApplicationService;

  /* READ */
  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @Get('/:id')
  @ApiOperation({ summary: 'Вывести по id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ViewApplicationGetResponseDto })
  async getOne(
    @CurrentAccount() account: IAccount,
    @Param() id: IViewApplication['id']
  ): Promise<ViewApplicationGetResponseDto> {

    const viewApplication = await this.viewApplicationService.findOne(id['id']);

    if (!viewApplication) {
      throw new NotFoundException(`id = ${id['id']} not found`);
    }

    const object = await this.baseObjectService.getObjectBySetObjectsId(viewApplication.object)
    if (!object){
      throw new NotFoundException(`id = ${id['id']} not found`);
    }
    if (account.role !== TRole.admin){
      if (object.owner){
        if (object.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }
    return viewApplication;

  }

  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @Get('/owner/:owner')
  @ApiOperation({ summary: 'Вывести все заявки по owner' })
  @ApiParam({ name: 'owner', example: 1, type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [ViewApplicationGetResponseDto] })
  async getByOwner (
    @CurrentAccount() account: IAccount,
    @Param() data: {owner: number}
  ): Promise<ViewApplicationGetResponseDto[]>{

    if (isNaN(Number(data.owner))){
      throw new NotFoundException(`owner must be more or equal 1`);
    }
    if (!data.owner || data.owner == 0) {
      throw new NotFoundException(`owner must be more or equal 1`);
    }

    if (account.role !== TRole.admin){
      if (data.owner != account.id){
        throw new ForbiddenException('access denied');
      }
    }

    /* получаю все объекта owner */
    const objects = await this.baseObjectService.getObjectsByOwner(data.owner, 0, 0);
    if (Object.keys(objects).length === 0){
      throw new NotFoundException(`This owner has no objects`);
    }
    /* */

    /* достаю найденные объекты из setObjects */
    const setObjects = []
    for (const object in objects){
      for (let item of objects[object]){
        let setObject = await this.baseObjectService.getSetObjectsByObjectIdByObjectType(item.id, item.objectname)
        if (setObject){
          const objectForOwner = await this.baseObjectService.getObjectBySetObjectsId(setObject, false)
          setObjects.push({
            setObjectId: setObject.id,
            objectname: item.objectname,
            id: item.id,
            owner: objectForOwner ? objectForOwner['owner'] : undefined
          })
        }
      }
    }

    if (setObjects.length === 0){
      throw new NotFoundException(`This owner has no objects`);
    }
    /* */

    /* иду в viewApplicationService за результатом */
    const result = await this.viewApplicationService.findByObjects(setObjects.map(function(s) {return s.setObjectId}));
    if (result.length === 0){
      throw new NotFoundException(`This owner has no applications for view`);
    }
    for (const r of result){
      r.object = setObjects.filter(i => i.setObjectId === r.object)[0]
      delete r.object['setObjectId']
    }
    /* */

    return result
  }

  @ApiBearerAuth()
  @Roles(TRole.agency, TRole.agent, TRole.developer, TRole.customer, TRole.admin, TRole.bank)
  @Get()
  @ApiOperation({ summary: 'Вывести все заявки по object' })
  @ApiQuery({ name: 'objectType', enum: TFor, example: TFor.apartment })
  @ApiQuery({ name: 'objectId', example: 1, type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ViewApplicationGetResponseDto })
  async getByObject(
    @CurrentAccount() account: IAccount,
    @Query() data: {objectType: TFor; objectId: number}
  ): Promise<ViewApplicationGetResponseDto>{

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

    const object = await this.baseObjectService.getObjectBySetObjectsId(setObjects)
    console.log(object)
    if (!object){
      throw new NotFoundException(`objectId = ${data.objectId} for entity ${data.objectType} doesn't exist`);
    }
    if (account.role !== TRole.admin){
      if (object.owner){
        if (object.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }

    const result = await this.viewApplicationService.findByObject(setObjects.id);
    if (!result){
      throw new NotFoundException(`Applications for view don't exist for this object`);
    }

    return result
  }
  /* */

  /* CREATE */
  @Post()
  @ApiOperation({ summary: 'Добавить' })
  @ApiQuery({ name: 'objectType', enum: TFor, example: TFor.apartment })
  @ApiQuery({ name: 'objectId', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, type: ViewApplicationPostResponseDto })
  async post(
    @Body() body: ViewApplicationPostBodyDto,
    @Query() data: {objectType: TFor; objectId: number}
  ): Promise<ViewApplicationPostResponseDto>{

    if (!data.objectType) {
      throw new NotFoundException(`objectType is not defined`);
    }
    if (!TFor[data.objectType]){
      throw new NotFoundException(`objectType must be one of ${Object.values(TFor)}`);
    }
    if (!data.objectId) {
      throw new NotFoundException(`objectId must be more or equal 1`);
    }



    let status: GuideEntity;

    if (body.status){
      status = await this.guideService.getByTypeByValue(TType_en.viewApplicationStatus, body.status)

      if (!status){
        throw new NotFoundException(`status = '${body.status}' doesn't exist`);
      }
    }
    const setObjects = await this.baseObjectService.getSetObjectsByObjectIdByObjectType(data.objectId, TFor[data.objectType])

    if (!setObjects){
      throw new NotFoundException(`objectId = ${data.objectId} for entity ${data.objectType} doesn't exist`);
    }

    body.agentName = setObjects['agentName'];

    // TODO Поправить получение agentName для созданеия заявки
    return this.viewApplicationService.create(body, setObjects, status)
  }
  /* */

  /* UPDATE */
  @Patch('/mark/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Пометить на удаление по id' })
  @ApiResponse({ status: HttpStatus.OK, type: ViewApplicationPostResponseDto })
  async mark(
    @CurrentAccount() account: IAccount,
    @Param() id: IViewApplication['id']
  ): Promise<ViewApplicationPostResponseDto> {

    const viewApplication = await this.viewApplicationService.findOne(id['id']);

    if (!viewApplication) {
      throw new NotFoundException(`id = ${id['id']} not found`);
    }

    const object = await this.baseObjectService.getObjectBySetObjectsId(viewApplication.object)
    if (!object){
      throw new NotFoundException(`id = ${id['id']} not found`);
    }
    if (account.role !== TRole.admin){
      if (object.owner){
        if (object.owner.id !== account.id){
          throw new ForbiddenException('access denied');
        }
      }
      else{
        throw new ForbiddenException('access denied');
      }
    }
    return this.viewApplicationService.mark(viewApplication, true)
  }
  /* */
}
