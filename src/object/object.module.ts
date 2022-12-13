import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComplexController } from './controllers/complex.controller';
import { TownhouseController } from './controllers/townhouse.controller';
import { ApartmentController } from './controllers/apartment.controller';
import { HouseController } from './controllers/house.controller';
import { LandController } from './controllers/land.controller';
import { BaseObjectService } from './services/baseObject.service';
import { ComplexService } from './services/complex.service';
import { ApartmentService } from './services/apartment.service';
import { TownhouseService } from './services/townhouse.service';
import { LandService } from './services/land.service';
import { HouseService } from './services/house.service';
import { GuideService } from '../guide/guide.service';
import { ApartmentEntity } from './entities/apartment.entity';
import { ApartmentPropertyEntity } from '../object-property/entities/apartmentProperty.entity';
import { ComplexEntity } from './entities/complex.entity';
import { ComplexPropertyEntity } from '../object-property/entities/complexProperty.entity';
import { TownhouseEntity } from './entities/townhouse.entity';
import { TownhousePropertyEntity } from '../object-property/entities/townhouseProperty.entity';
import { HouseEntity } from './entities/house.entity';
import { HousePropertyEntity } from '../object-property/entities/houseProperty.entity';
import { LandEntity } from './entities/land.entity';
import { LandPropertyEntity } from '../object-property/entities/landProperty.entity';
import { StatusEntity } from './entities/status.entity';
import { SetObjectsEntity } from './entities/setObjects.entity';
import { AccountEntity } from '../account/entities/account.entity';
import { GuideEntity } from '../guide/entities/guide.entity';
import { AccountService } from '../account/account.service';
import { ConstructionProgressService } from '../construction-progress/construction-progress.service';
import { ConstructionProgressEntity } from '../construction-progress/entities/construction-progress.entity';
import { DeveloperService } from '../account-property/services/developer.service';
import { DeveloperEntity } from '../account-property/entities/developer.entity';
import { FileService } from '../file/file.service';
import { FileEntity } from '../file/entities/file.entity';
import { AgentEntity } from '../account-property/entities/agent.entity';
import { StatusController } from './controllers/status.controller';
import { StatusService } from './services/status.service';
import { CustomerEntity } from '../account-property/entities/customer.entity';
import { BaseObjectController } from './controllers/baseObject.controller';
import { ApartmentPropertyService } from '../object-property/services/apartment-property.service';
import { LeagalPurityService } from '../leagal-purity/leagal-purity.service';
import { LegalPurityEntity } from '../leagal-purity/entities/legalPurity.entity';
import { RegionEntity } from '../region/entities/region.entity';
import { CityEntity } from '../city/entities/city.entity';
import { CountryEntity } from '../country/entities/country.entity';
import { MinioClientModule } from '../minio-client/minio.client.module';
import { NestMinioModule } from 'nestjs-minio';

@Module({
  imports: [
    MinioClientModule,
    NestMinioModule.register({
      endPoint: 's3.dtln.ru',
      port: 80,
      useSSL: false,
      accessKey: '00b72667e8e05ad9b551',
      secretKey: '6tNn5iP8FPPHORwrm6ygN7DNPmi67Txe7RyONg7',
    }),
    TypeOrmModule.forFeature([
      ApartmentEntity,
      ApartmentPropertyEntity,
      ComplexEntity,
      ComplexPropertyEntity,
      TownhouseEntity,
      TownhousePropertyEntity,
      HouseEntity,
      HousePropertyEntity,
      LandEntity,
      LandPropertyEntity,
      StatusEntity,
      AccountEntity,
      GuideEntity,
      FileEntity,
      SetObjectsEntity,
      AccountEntity,
      ConstructionProgressEntity,
      DeveloperEntity,
      AgentEntity,
      CustomerEntity,
      LegalPurityEntity,
      RegionEntity,
      CityEntity,
      CountryEntity
    ]),
  ],
  controllers: [
    ComplexController,
    TownhouseController,
    ApartmentController,
    HouseController,
    LandController,
    StatusController,
    BaseObjectController,
  ],
  providers: [
    ComplexService,
    TownhouseService,
    ApartmentService,
    HouseService,
    LandService,
    BaseObjectService,
    GuideService,
    FileService,
    AccountService,
    ConstructionProgressService,
    DeveloperService,
    StatusService,
    ApartmentPropertyService,
    LeagalPurityService
  ]
})
export class ObjectModule {}
