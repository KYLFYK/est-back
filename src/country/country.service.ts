import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from './entities/country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryEntityRepository: Repository<CountryEntity>,
  ) {}

  async findAll(): Promise<CountryEntity[]>{
    return this.countryEntityRepository.find({
      order: {
        id: 'ASC'
      }
    })
  }
}
