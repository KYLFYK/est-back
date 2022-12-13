import { BadRequestException, Injectable } from '@nestjs/common';
import { ISearch } from './interfaces/ISearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TownhouseEntity } from '../object/entities/townhouse.entity';
import { ApartmentEntity } from '../object/entities/apartment.entity';
import { HouseEntity } from '../object/entities/house.entity';
import { LandEntity } from '../object/entities/land.entity';
import { GuideEntity } from '../guide/entities/guide.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(TownhouseEntity)
    private townhouseEntityRepository: Repository<TownhouseEntity>,
    @InjectRepository(ApartmentEntity)
    private apartmentEntityRepository: Repository<ApartmentEntity>,
    @InjectRepository(HouseEntity)
    private houseEntityRepository: Repository<HouseEntity>,
    @InjectRepository(LandEntity)
    private landEntityRepository: Repository<LandEntity>,
    @InjectRepository(GuideEntity)
    private guideEntityRepository: Repository<GuideEntity>,
  ) {
  }
  async search(searchData: ISearch) {
    let object,
      publicationType,
      buildingType,
      floor = '',
      city,
      rooms = ['studio', 'one', 'two', 'three', 'four', 'five', 'six', 'free_plan'];

    !searchData['city'] ? city = 1: city = searchData['city'];

    switch (searchData['building-type']) {
      case 'new':
        buildingType = 'Новостройка';
        break;
      case 'old':
        buildingType = 'Вторичка';
        break;
      default:
        break;
    }

    switch (searchData['order-type']) {
      case 'buy':
        publicationType= 'Покупка';
        break;
      case 'sale':
        publicationType= 'Продажа';
        break;
      case 'rent':
        publicationType= 'Аренда';
        break;
      default:
        break;
    }

    if(!searchData['price-to']) {
      searchData['price-to'] = 1000000000
    }

    if(!searchData['price-from']) {
      searchData['price-from'] = 0;
    }

    if(!searchData['square-to']) {
      searchData['square-to'] = 100000000
    }

    if(!searchData['square-from']) {
      searchData['square-from'] = 0;
    }

    if(searchData['floor']) {
      floor = `AND property.floor = ${searchData['floor']}`
    }

    const mapping = {
      'townhouse': this.townhouseEntityRepository.metadata,
      'house': this.houseEntityRepository.metadata,
      'land': this.landEntityRepository.metadata,
      'apartment': this.apartmentEntityRepository.metadata,
    }

    const tableName  = mapping[searchData['object-type']].tableName;


    let _rooms, qb


    switch (searchData['object-type']) {
      case 'townhouse':

        if(searchData['rooms-in-house']) {
          if(typeof searchData['rooms-in-house'] == 'string') {
            _rooms = searchData['rooms-in-house'];
          }else{
            _rooms = searchData['rooms-in-house'].join('\',\'');
          }
        }else {
          throw new BadRequestException('Не хватает парметра rooms-in-house')
        }

         qb = this.townhouseEntityRepository.createQueryBuilder(tableName)
          .leftJoinAndSelect(`${tableName}.complex`, 'complex')
          .leftJoinAndSelect(`${tableName}.property`, 'property')
          .innerJoinAndSelect(
            `${tableName}.guides`,
            'guides',
            `guides.id IN (
              SELECT id FROM guide g WHERE 
                g.value IN ('${buildingType}')
               
            )`
          )
          .leftJoinAndSelect(`${tableName}.files`, 'file')
          .where(` property.area BETWEEN ${searchData['square-from']} AND ${searchData['square-to']} AND ${tableName}.objectType = '${searchData['order-type']}' ${floor}`)
          .andWhere(`${tableName}.price BETWEEN ${searchData['price-from']} AND ${searchData['price-to']}`)
           .andWhere(`townhouse.markAsDelete = 'false'`)
           .andWhere(`complex.city = ${city}`)

        if(_rooms && _rooms.length > 0) {
          qb.andWhere(`property.rooms IN ('${_rooms}')`)
        }

        qb.orderBy(`${tableName}.updateAt`, 'ASC')



        break;
      case 'house':
        // const { tableName } = this.houseEntityRepository.metadata;
        if(searchData['rooms-in-house']) {
          if(typeof searchData['rooms-in-house'] == 'string') {
            _rooms = searchData['rooms-in-house'];
          }else{
            _rooms = searchData['rooms-in-house'].join('\',\'');
          }
        }else {
          throw new BadRequestException('Не хватает парметра rooms-in-house')
        }

        qb = this.houseEntityRepository
          .createQueryBuilder(tableName)
          .leftJoinAndSelect(`${tableName}.complex`, 'complex')
          .leftJoinAndSelect(`${tableName}.property`, 'property')
          .innerJoinAndSelect(
            `${tableName}.guides`,
            'guides',
            `guides.id IN (
              SELECT id FROM guide g WHERE 
                g.value IN ('${buildingType}')
               
            )`
          )
          .leftJoinAndSelect(`${tableName}.files`, 'file')
          .where(` property.area BETWEEN ${searchData['square-from']} AND ${searchData['square-to']} AND ${tableName}.objectType = '${searchData['order-type']}' ${floor}`)
          .andWhere(`${tableName}.price BETWEEN ${searchData['price-from']} AND ${searchData['price-to']}`)
          .andWhere(`property.rooms IN ('${_rooms}')`)
          .andWhere(`house.markAsDelete = 'false'`)
          .andWhere(`house.city = ${city}`)
          .orderBy(`${tableName}.updateAt`, 'ASC')

        // object = await this.houseEntityRepository.find({
        //   relations: [
        //     'guides',
        //     'complex',
        //     'file'
        //   ]
        // });
        break;
      case 'land':
        const arr = []
        if(searchData.benefit && searchData.benefit.length > 0) {
          searchData.benefit.forEach(item => {
            arr.push(item)
          })
        }
        // arr.push(publicationType)
        arr.push(buildingType)
        qb = this.landEntityRepository
          .createQueryBuilder(tableName)
          // .leftJoinAndSelect(`${tableName}.complex`, 'complex')
          .leftJoinAndSelect(`${tableName}.property`, 'property')
          .innerJoinAndSelect(
            `${tableName}.guides`,
            'guides',
            `guides.id IN (
              SELECT id FROM guide g WHERE 
                g.value IN (:...benefit) 
            )`, {benefit: arr}
          )


          .leftJoinAndSelect(`${tableName}.files`, 'file')
          .where(` property.area BETWEEN ${searchData['square-from']} AND ${searchData['square-to']} AND ${tableName}.objectType = '${searchData['order-type']}' ${floor}`)
          .andWhere(`${tableName}.price BETWEEN ${searchData['price-from']} AND ${searchData['price-to']}`)
          .andWhere(`land.markAsDelete = 'false'`)
          .andWhere(`land.city = ${city}`)
          .orderBy(`${tableName}.updateAt`, 'ASC')

        // object = await this.landEntityRepository.find({
        //   relations: [
        //     'guides',
        //     'file'
        //   ]
        // });
        break;
      case 'apartment':
        if(searchData['rooms-in-apartment']) {
          if(typeof searchData['rooms-in-apartment'] == 'string') {
            _rooms = searchData['rooms-in-apartment'];
          }else{
            _rooms = searchData['rooms-in-apartment'].join('\',\'');
          }
        } else {
          throw new BadRequestException('Не хватает парметра rooms-in-apartment')
        }

        qb = this.apartmentEntityRepository
          .createQueryBuilder(tableName)
          .leftJoinAndSelect(`${tableName}.complex`, 'complex')
          .leftJoinAndSelect(`${tableName}.property`, 'property')
          .innerJoinAndSelect(
            `${tableName}.guides`,
            'guides',
            `guides.id IN (
              SELECT id FROM guide g WHERE 
                g.value IN ('${buildingType}')
            )`
          )
          .leftJoinAndSelect(`${tableName}.files`, 'file')
          .where(` property.area BETWEEN ${searchData['square-from']} AND ${searchData['square-to']} AND ${tableName}.objectType = '${searchData['order-type']}' ${floor}`)
          .andWhere(`${tableName}.price BETWEEN ${Number(searchData['price-from'])} AND ${Number(searchData['price-to'])}`)
          .andWhere(`apartment.markAsDelete = 'false'`)
          .andWhere(`apartment.city = ${city}`)

          if(_rooms && _rooms.length > 0) {
            qb.andWhere(`property.rooms IN ('${_rooms}')`)
          }

          qb.orderBy(`${tableName}.updateAt`, 'ASC')

        // object = await this.apartmentEntityRepository.find({
        //   relations: [
        //     'guides',
        //     'complex',
        //     'file'
        //   ]
        // });
        break;
      default:
        break;
    }

    object = qb.getMany()

    return await object;
  }
}
