import * as path from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './account/guards/role';
import { GlobalAccountGuard } from './account/guards/globalAccount';
import { AuthEntity } from './auth/entities/auth.entity';
import { AccountEntity } from './account/entities/account.entity';
import { CustomerEntity } from './account-property/entities/customer.entity';
import { DeveloperEntity } from './account-property/entities/developer.entity';
import { AgencyEntity } from './account-property/entities/agency.entity';
import { AgentEntity } from './account-property/entities/agent.entity';
import { AdminEntity } from './account-property/entities/admin.entity';

import { GuideEntity } from './guide/entities/guide.entity';
import { ApartmentEntity } from './object/entities/apartment.entity';
import { ApartmentPropertyEntity } from './object-property/entities/apartmentProperty.entity';
import { ComplexEntity } from './object/entities/complex.entity';
import { ComplexPropertyEntity } from './object-property/entities/complexProperty.entity';
import { HouseEntity } from './object/entities/house.entity';
import { HousePropertyEntity } from './object-property/entities/houseProperty.entity';
import { LandEntity } from './object/entities/land.entity';
import { LandPropertyEntity } from './object-property/entities/landProperty.entity';
import { TownhouseEntity } from './object/entities/townhouse.entity';
import { TownhousePropertyEntity } from './object-property/entities/townhouseProperty.entity';
import { StatusEntity } from './object/entities/status.entity';
import { SetObjectsEntity } from './object/entities/setObjects.entity';

import { LegalPurityEntity } from './leagal-purity/entities/legalPurity.entity';
import { ViewApplicationEntity } from './view-application/entities/view-application.entity';
import { NewsSubscriptionEntity } from './news-subscription/entities/news-subscription.entity';
import { ConstructionProgressEntity } from './construction-progress/entities/construction-progress.entity';

import { ApartmentSubscriber, HouseSubscriber, TownhouseSubscriber, LandSubscriber, ComplexSubscriber } from './object/subscribers/object.subscriber';

import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { PropertyModule } from './account-property/property.module';
import { ObjectModule } from './object/object.module';
import { GuideModule } from './guide/guide.module';
import { MediaModule } from './media/media.module';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { FileEntity } from './file/entities/file.entity';
import { LeagalPurityModule } from './leagal-purity/leagal-purity.module';
import { SearchModule } from './search/search.module';
import { ViewApplicationModule } from './view-application/view-application.module';
import { NewsSubscriptionModule } from './news-subscription/news-subscription.module';
import { ConstructionProgressModule } from './construction-progress/construction-progress.module';
import { RegionModule } from './region/region.module';
import { RegionEntity } from './region/entities/region.entity';
import { PressModule } from './press/press.module';
import { PressEntity } from './press/entities/press.entity';
import { BankEntity } from './account-property/entities/bank.entity';
import { ChatGateway } from './chat/chat.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CityEntity } from './city/entities/city.entity';
import { CityModule } from './city/city.module';
import { CountryModule } from './country/country.module';
import { CountryEntity } from './country/entities/country.entity';
import { LeadsModule } from './leads/leads.module';
import { LeadsEntity } from './leads/entities/leads.entity';
import { EarlyPaymentEntity } from './leads/entities/early.payment.entity';
import { MinioClientModule } from './minio-client/minio.client.module';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve( __dirname, '../../', (process.env.NODE_ENV === 'development') ? '.dev.env' : '.prod.env'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [
          FileEntity,
          AuthEntity,
          AccountEntity,
          CustomerEntity,
          DeveloperEntity,
          AgencyEntity,
          AgentEntity,
          AdminEntity,
          BankEntity,
          GuideEntity,
          ApartmentEntity,
          ApartmentPropertyEntity,
          LandEntity,
          LandPropertyEntity,
          TownhouseEntity,
          TownhousePropertyEntity,
          HouseEntity,
          HousePropertyEntity,
          ComplexEntity,
          ComplexPropertyEntity,
          StatusEntity,
          SetObjectsEntity,
          LegalPurityEntity,
          ViewApplicationEntity,
          NewsSubscriptionEntity,
          ConstructionProgressEntity,
          RegionEntity,
          CityEntity,
          PressEntity,
          CountryEntity,
          LeadsEntity,
          EarlyPaymentEntity,
        ],
        subscribers: [
          ApartmentSubscriber,
          HouseSubscriber,
          TownhouseSubscriber,
          LandSubscriber,
          ComplexSubscriber,
        ],
        synchronize: process.env.NODE_ENV === 'development',
        ssl: process.env.NODE_ENV === 'production' ? {
          ca: path.resolve(__dirname, '../', 'keys', process.env.POSTGRES_KEY),
        } : false,
      }),
    }),

    JwtModule.register({
      secret: process.env.SECRET_KEY || 'TEST_SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/public',
      rootPath: path.join(__dirname, '../../', 'public'),
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: 'smtps://noreply@f-case.ru:gyvakjqkcqazhfrg@smtp.yandex.ru:465',
        defaults: {
          from: 'noreply@f-case.ru',
        },
      }),
    }),

    AuthModule,
    AccountModule,
    PropertyModule,
    ObjectModule,
    GuideModule,
    MediaModule,
    FileModule,
    MailModule,
    LeagalPurityModule,
    SearchModule,
    ViewApplicationModule,
    NewsSubscriptionModule,
    ConstructionProgressModule,
    RegionModule,
    PressModule,
    CityModule,
    CountryModule,
    LeadsModule,
    MinioClientModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalAccountGuard,
    },
    ChatGateway
  ]
})
export class AppModule {}
