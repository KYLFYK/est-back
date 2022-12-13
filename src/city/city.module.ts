import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { CityEntity } from './entities/city.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from '../region/entities/region.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CityEntity,
      RegionEntity
    ])
  ],
  providers: [CityService],
  controllers: [CityController]
})
export class CityModule {}
