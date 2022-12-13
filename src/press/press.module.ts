import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeveloperEntity } from '../account-property/entities/developer.entity';
import { PressEntity } from './entities/press.entity';
import { PressService } from './press.service';
import { PressController } from './press.controller';
import { AccountService } from '../account/account.service';
import { AccountEntity } from '../account/entities/account.entity';
import { DeveloperService } from '../account-property/services/developer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PressEntity,
      DeveloperEntity,
      AccountEntity
    ])
  ],
  providers: [PressService, AccountService, DeveloperService],
  controllers: [PressController]
})
export class PressModule {}
