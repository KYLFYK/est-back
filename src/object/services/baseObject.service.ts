import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, getManager, In, Repository } from 'typeorm';

import { IAccount } from '../../account/interfaces/account.interface';
import { ISetObjects } from '../interfaces/setObjects.interface';

import { SetObjectsEntity } from '../entities/setObjects.entity';
import { AccountEntity } from '../../account/entities/account.entity';
import { HouseEntity } from '../entities/house.entity';
import { LandEntity } from '../entities/land.entity';
import { ApartmentEntity } from '../entities/apartment.entity';
import { TownhouseEntity } from '../entities/townhouse.entity';

import { GuideService } from '../../guide/guide.service';

import { TFor } from '../../guide/types/for';
import { TType_en } from '../../guide/types/type';
import { ComplexEntity } from '../entities/complex.entity';

@Injectable()
export class BaseObjectService {

  constructor(
    @InjectRepository(SetObjectsEntity)
    private setObjectsEntityRepository: Repository<SetObjectsEntity>,

    @InjectRepository(AccountEntity)
    private accountEntityRepository: Repository<AccountEntity>,

    @InjectRepository(TownhouseEntity)
    private townhouseEntityRepository: Repository<TownhouseEntity>,
    @InjectRepository(ApartmentEntity)
    private apartmentEntityRepository: Repository<ApartmentEntity>,
    @InjectRepository(HouseEntity)
    private houseEntityRepository: Repository<HouseEntity>,
    @InjectRepository(LandEntity)
    private landEntityRepository: Repository<LandEntity>,
    @InjectRepository(ComplexEntity)
    private complexEntityRepository: Repository<ComplexEntity>,

  ) { }

  @Inject()
  private readonly guideService: GuideService;

  /*
    Метод на вход получает название сущности. На выходе ожидается сущность с типом Repository
    Например, 'apartment' -> apartmentEntityRepository
  */
  getRepositoryByName(name: TFor | string): Repository<unknown> {
    switch (name) {
      case 'townhouse':
        return this.townhouseEntityRepository
      case 'house':
        return this.houseEntityRepository
      case 'land':
        return this.landEntityRepository
      case 'apartment':
        return this.apartmentEntityRepository
      case 'complex':
        return this.complexEntityRepository
    }
  }

  /*
    Метод предназначен для поиска одной записи в таблице apartment, house etc.
    Поиск ведется по setObjects
    Если getObjectType активен, то возвращается дополнительное свойство objectType: 'house' (например)
  */
  async getObjectBySetObjectsId(setObjects: ISetObjects, getObjectType: boolean = false): Promise<any> {
    setObjects = await this.setObjectsEntityRepository.findOne(setObjects)

    if (setObjects) {
      const objectType = await this.guideService.findOne(Number(setObjects.objectType))

      const entity = this.getRepositoryByName(objectType.value)
      if (entity) {
        const result = await entity.findOne({
          where: {
            id: setObjects.objectId
          },
          relations: ['owner']
        });
        if (result && getObjectType) {
          result["objectType"] = objectType.value
        }
        return result
      }
    }

  }

  /*
    Метод предназначен для поиска в таблице setObjects одной записи
    1. objectId - id объекта
    2. objectType - apartment, house, etc
  */
  async getSetObjectsByObjectIdByObjectType(objectId: ISetObjects['objectId'], objectType: TFor): Promise<SetObjectsEntity | undefined> {

    const guide = await this.guideService.getByTypeByValue(TType_en.objectType, TFor[objectType])

    if (!guide) {
      return undefined
    }

    let objectOwner = {}
    switch (objectType) {
      case TFor.apartment:
        objectOwner = await this.apartmentEntityRepository.findOne(objectId, { relations: ['owner','owner.agentProperty']})
        break;
      case TFor.house:
        objectOwner = await this.houseEntityRepository.findOne(objectId, { relations: ['owner','owner.agentProperty']})
        break;
      case TFor.land:
        objectOwner = await this.landEntityRepository.findOne(objectId, { relations: ['owner','owner.agentProperty']})
        break;
      case TFor.complex:
        objectOwner = await this.complexEntityRepository.findOne(objectId, { relations: ['owner','owner.agentProperty']})
        break;
      case TFor.townhouse:
        objectOwner = await this.townhouseEntityRepository.findOne(objectId, { relations: ['owner','owner.agentProperty']})
        break;
    }

    const data = await this.setObjectsEntityRepository.findOne({
      where: {
        objectType: guide,
        objectId: objectId
      }
    })

    data['agentName'] = objectOwner['owner']['email'];

    return data

  }

  /* метод возвращает список всех объектов по owner */
  async getObjectsByOwner(ownerId: IAccount['id'], take: number, skip: number): Promise<Array<any>> {
    const owner = await this.accountEntityRepository.findOne(ownerId)
    if (!owner) {
      throw new BadRequestException(`owner = ${ownerId} doesn't exist`);
    }
    const entityManager = getManager();
    const result = []

    const res = await entityManager.query(`
      select id, 'house' as objectname from house h where owner = ${owner.id}
      union all
      select id, 'townhouse' as objectname from townhouse t where owner = ${owner.id}
      union all
      select id, 'apartment' as objectname from apartment a where owner = ${owner.id}
      union all
      select id, 'complex' as objectname from complex c where "ownerId" = ${owner.id}
      union all
      select id, 'land' as objectname from land l where owner = ${owner.id}
      ${take > 0 ? 'limit ' + take : ' '}
      offset ${skip}`
    );

    const idsObjectName = []

    for (const r of res){
      const findIndex = idsObjectName.findIndex(function(object) {
        return object.objectname === r.objectname;
      });

      if (findIndex === -1){
        idsObjectName.push({
          objectname: r.objectname,
          ids: [r.id]
        })
      }
      else{
        idsObjectName[findIndex]['ids'].push(r.id)
      }
    }

    for (const o of idsObjectName){
      const rep = this.getRepositoryByName(o.objectname)
      let objects_res = await rep.findByIds(o.ids, {relations: ['guides', 'property']})
      result.push(
        objects_res.map(element => Object.assign(element, {objectname: o.objectname}))
      )
    }
    return result;

        /*
        if (groupObjects) {
          result[rep.metadata.tableName] = res
        }
        */
  }

  async getBestOffers(
    take: number = 3,
    isApartment: boolean,
    isHouse: boolean,
    isComplex: boolean,
    isNew: boolean,
    isOld: boolean,
    city?: number
  ): Promise<Array<any>>{

    !city? city=1: '';

    if (!isApartment && !isHouse && !isComplex && !isNew && !isOld){
      isApartment = true;
      isHouse = true;
      isComplex = true;
      isNew = true;
      isOld = true;
    }
    let result = []

    if(!isNew) {

    } else if(!isOld) {

    }else{

    }
    let houses = []
    if (isHouse){
      houses = await this.houseEntityRepository.find({
        relations: ['guides', 'property', 'files'],
        where: {
          markAsDelete: false,
          city
        },
        order: {
          views: 'DESC'
        },
        take: take
      })

      if (houses.length > 0){
        houses.forEach(function(item) {
          item.guides = item.guides.filter( itemFilter => itemFilter.type_en === 'buildingType')
          item['objectName'] = 'house'
        });
        result = [...result, ...houses]
      }
    }

    let apartments = []
    if (isApartment){
      apartments = await this.apartmentEntityRepository.find({
        relations: ['guides', 'property', 'files'],
        where: {
          markAsDelete: false,
          city
        },
        order: {
          views: 'DESC'
        },
        take: take
      })

      if (apartments.length > 0){
        apartments.forEach(function(item) {
          item.guides = item.guides.filter( itemFilter => itemFilter.type_en === 'buildingType')
          item['objectName'] = 'apartment'
        });
        result = [...result, ...apartments]
      }
    }

    if (isComplex){
      let complexes = await this.complexEntityRepository.find({
        relations: ['property', 'files'],
        where: {
          markAsDelete: false,
          city
        },
        order: {
          views: 'DESC'
        },
        take: take
      })
      complexes = complexes.map(item => ({ ...item, objectName: 'complex' }))
      if (complexes.length > 0){
        result = [...result, ...complexes]
      }
    }

    if (isNew || isOld){
      let apartmentsFilter = await this.apartmentEntityRepository
        .createQueryBuilder('apartment')
        .leftJoinAndSelect('apartment.guides', 'guide')
        .leftJoinAndSelect('apartment.property', 'property')
        .leftJoinAndSelect('apartment.files', 'files')
        .where(apartments.length > 0 ? `apartment.id not in (${apartments.map(i => i.id).join(',')})` : '1=1')
        .andWhere(`apartment.markAsDelete = 'false'`)
        .andWhere(`apartment.city = ${city}`)
        .andWhere(new Brackets(qb => {qb
          .where(isNew ? `guide.value = 'Новостройка' and guide.type_en = 'buildingType'` : '1<>1')
          .orWhere(isOld ? `guide.value = 'Вторичка' and guide.type_en = 'buildingType'` : '1<>1')
        }))
        .orderBy('apartment.views', 'DESC')
        .take(take)
        .getMany()
        .catch(e => {
          throw new BadRequestException(e.message);
        });
      if (apartmentsFilter.length > 0){
        apartmentsFilter = apartmentsFilter.map(item => ({ ...item, objectName: 'apartment' }))
        result = [...result, ...apartmentsFilter]
      }

      let housesFilter = await this.houseEntityRepository
        .createQueryBuilder('house')
        .leftJoinAndSelect('house.guides', 'guide')
        .leftJoinAndSelect('house.property', 'property')
        .leftJoinAndSelect('house.files', 'files')
        .where(houses.length > 0 ? `house.id not in (${houses.map(i => i.id).join(',')})` : '1=1')
        .andWhere(`house.markAsDelete = 'false'`)
        .andWhere(`house.city = ${city}`)
        .andWhere(new Brackets(qb => {qb
          .where(isNew ? `guide.value = 'Новостройка' and guide.type_en = 'buildingType'` : '1<>1')
          .orWhere(isOld ? `guide.value = 'Вторичка' and guide.type_en = 'buildingType'` : '1<>1')
        }))
        .orderBy('house.views', 'DESC')
        .take(take)
        .getMany()
        .catch(e => {
          throw new BadRequestException(e.message);
        });
      if (housesFilter.length > 0){
        housesFilter = housesFilter.map(item => ({ ...item, objectName: 'house' }))
        result = [...result, ...housesFilter]
      }
    }

    result = result.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0))
    if (result.length > take){
      result = result.slice(0, take)
    }

    return result
  }

  async getFavoriteObjects(owner: IAccount['id']): Promise<Array<any>>{
    const result = []

    const objects = ['apartment', 'house', 'complex', 'land']
    for (const o of objects){
      const res = await this.getRepositoryByName(o)
        .createQueryBuilder(o)
        .leftJoinAndSelect(`${o}.favorite`, 'favorite')
        .where(`favorite.id = ${owner}`)
        .getMany()

      if (res.length > 0){
        result.push({
          id: res.map( item => item['id']),
          objectType: o
        })
      }
    }
    return result
  }

  /*
    Метод предназначен для увеличения кол-ва просмотров
    foundData - запись, для которой нужно увеличить значение
  */
  async incrementViews(foundData: any, entity: string): Promise<void> {
    let repository: Repository<any>;
    if (entity) {
      repository = this.getRepositoryByName(entity)
    }

    if (foundData['views'] !== undefined && foundData['views'] !== null && repository) {

      const update = repository.merge(foundData, { views: foundData['views'] + 1 });
      await repository
        .save(update)
        .catch(e => {
          throw new BadRequestException(e.message);
        });
    }
  }

  async transformFromIdToObject(id: any, entity: Repository<any>, errorDescription: string): Promise<any> {

    if (id === undefined || id === null) {
      return id;
    }
    else if (!id){
      return undefined
    }
    else {
      if (!isNaN(id)){
        id = Number(id)
      }
      let result: any;
      // if input data is number
      if (typeof id === "number") {
        result = await entity.findOne(id)
        if (!result) {
          throw new NotFoundException(`${errorDescription}`);
        }
      }
      // if input data is array
      else {
        result = await entity.find({
          where: { id: In(id) }
        });
        if (result.length === 0) {
          throw new NotFoundException(`${errorDescription}`);
        }
      }
      return result;
    }
  }

  async getObjectInRadius(long: number, lat: number) {
    const entityManage = getManager();

    let sql = "SELECT" +
      " *, (" +
      " 6371 * acos (" +
      " cos ( radians("+long+") )" +
      " * cos( radians( latitude ) )" +
      " * cos( radians( longitude ) - radians("+lat+") )" +
      " + sin ( radians("+long+") )" +
      " * sin( radians( latitude ) )" +
      " )" +
      ") as distance " +
      "FROM house " +
      // "HAVING distance < 20 " +
      "ORDER BY distance ASC " +
      "LIMIT 3";
    return await entityManage.query(sql);
  }

}
