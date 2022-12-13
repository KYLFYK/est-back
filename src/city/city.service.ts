import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from './entities/city.entity';
import { ICity } from './interfaces/city.interface';
import { RegionEntity } from '../region/entities/region.entity';
import { RegionCreateDto } from '../region/dto/region.create.dto';
import { CityCreateDto } from './dto/city.body.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private cityEntityRepository: Repository<CityEntity>,
    @InjectRepository(RegionEntity)
    private regionEntityRepository: Repository<RegionEntity>,
  ) {}

  async findAll(): Promise<CityEntity[]>{
    return this.cityEntityRepository.find({
      order: {
        id: 'ASC'
      },
      relations: ['region']
    })
  }

  async findOne(id: ICity['id']): Promise<CityEntity> {
    return await this.cityEntityRepository.findOne(id)
  }

  async create(data): Promise<CityEntity> {
    const region = await this.regionEntityRepository.findOne(data.regionId);

    if(!region) {
      throw new BadRequestException('Region is not found')
    }
    data.region = region;
    return await this.cityEntityRepository.save(data)
  }

  async update(foundData: CityEntity, updateData: CityCreateDto): Promise<CityEntity> {

    const region = await this.regionEntityRepository.findOne(updateData.regionId);

    if(!region) {
      throw new BadRequestException('Region is not found')
    }

    updateData['region'] = region;

    const update = this.cityEntityRepository.merge(foundData, updateData);

    return this.cityEntityRepository
      .save(update)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
}
