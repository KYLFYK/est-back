import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountEntity } from './entities/account.entity';
import { AccountController } from './account.controller';
import { DeveloperService } from '../account-property/services/developer.service';
import { DeveloperEntity } from '../account-property/entities/developer.entity';
import { AgentEntity } from '../account-property/entities/agent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      DeveloperEntity,
      AgentEntity
    ]),
  ],
  controllers: [
    AccountController,
  ],
  providers: [AccountService, DeveloperService],
  exports: [AccountService],
})
export class AccountModule {}
