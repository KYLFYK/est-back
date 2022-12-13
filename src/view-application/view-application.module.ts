import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewApplicationController } from './view-application.controller';
import { GuideService } from '../guide/guide.service';
import { BaseObjectService } from '../object/services/baseObject.service';
import { ViewApplicationEntity } from './entities/view-application.entity';
import { GuideEntity } from '../guide/entities/guide.entity';
import { SetObjectsEntity } from '../object/entities/setObjects.entity';
import { ViewApplicationService } from './view-application.service';
import { AccountEntity } from '../account/entities/account.entity';
import { ApartmentEntity } from '../object/entities/apartment.entity';
import { HouseEntity } from '../object/entities/house.entity';
import { TownhouseEntity } from '../object/entities/townhouse.entity';
import { LandEntity } from '../object/entities/land.entity';
import { ComplexEntity } from '../object/entities/complex.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GuideEntity,
      AccountEntity,
      SetObjectsEntity,
      ViewApplicationEntity,
      ApartmentEntity,
      HouseEntity,
      TownhouseEntity,
      LandEntity,
      ComplexEntity,
    ])
  ],
  controllers: [ViewApplicationController],
  providers: [GuideService, BaseObjectService, ViewApplicationService],
})
export class ViewApplicationModule {}
