import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegionEntity } from './entities/region.entity';
import { RegionCreateDto } from './dto/region.create.dto';
import { IRegion } from './interfaces/region.interface';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(RegionEntity)
    private regionEntityRepository: Repository<RegionEntity>,
  ) {}

  async findAll(): Promise<RegionEntity[]>{
    return this.regionEntityRepository.find({
      order: {
        id: 'ASC'
      },
    })
  }

  async findOne(id: IRegion['id']) {
    return await this.regionEntityRepository.findOne(id)
  }

  async create(data): Promise<RegionEntity> {
    console.log(data)
    return await this.regionEntityRepository.save(data)
  }

  async update(foundData: RegionEntity, updateData: RegionCreateDto): Promise<RegionEntity> {

    const update = this.regionEntityRepository.merge(foundData, updateData);

    return this.regionEntityRepository
      .save(update)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
}
