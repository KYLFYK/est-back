import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentEntity } from '../object/entities/apartment.entity';
import { ComplexEntity } from '../object/entities/complex.entity';
import { HouseEntity } from '../object/entities/house.entity';
import { LandEntity } from '../object/entities/land.entity';
import { TownhouseEntity } from '../object/entities/townhouse.entity';
import { GuideEntity } from '../guide/entities/guide.entity';

@Module({
  controllers: [SearchController],
  imports: [
    TypeOrmModule.forFeature([
      ApartmentEntity,
      ComplexEntity,
      HouseEntity,
      LandEntity,
      TownhouseEntity,
      GuideEntity,
    ])
  ],
  providers: [SearchService]
})
export class SearchModule {}
