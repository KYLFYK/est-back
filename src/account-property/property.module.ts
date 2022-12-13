import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { DeveloperEntity } from './entities/developer.entity';
import { AgencyEntity } from './entities/agency.entity';
import { AgentEntity } from './entities/agent.entity';
import { AdminEntity } from './entities/admin.entity';
import { AccountEntity } from '../account/entities/account.entity';
import { AccountService } from '../account/account.service';
import { DeveloperController } from './controllers/developer.controller';
import { DeveloperService } from './services/developer.service';
import { PressEntity } from '../press/entities/press.entity';
import { BankEntity } from './entities/bank.entity';
import { AgentService } from './services/agent.service';
import { AgentController } from './controllers/agent.controller';
import { AgencyController } from './controllers/agency.controller';
import { AgencyService } from './services/agency.service';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      DeveloperEntity,
      AgencyEntity,
      AccountEntity,
      AgentEntity,
      AdminEntity,
      BankEntity,
      PressEntity
    ]),
  ],
  controllers: [DeveloperController, AgentController, AgencyController, CustomerController],
  providers: [CustomerService, DeveloperService, AgentService, AgencyService, AccountService],
  exports: [CustomerService, DeveloperService, AgentService, AgencyService, AccountService]
})
export class PropertyModule { }
