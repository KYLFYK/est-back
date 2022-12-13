import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerEntity } from './entities/customer.entity';
import { AdminEntity } from './entities/admin.entity';
import { AccountEntity } from '../account/entities/account.entity';

import { TRole } from '../account/types/role';
import { AgentEntity } from './entities/agent.entity';
import { AgencyEntity } from './entities/agency.entity';
import { DeveloperEntity } from './entities/developer.entity';
import { BankEntity } from './entities/bank.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminEntityRepository: Repository<AdminEntity>,
  ) {}
  
  getRepositoryByRole(role: TRole): any {
    switch (role) {
      case TRole.customer:
        return CustomerEntity
      case TRole.agency:
        return AgencyEntity
      case TRole.agent:
        return AgentEntity
      case TRole.developer:
        return DeveloperEntity
      case TRole.bank:
        return BankEntity        
    }
  }

  async log (role: TRole): Promise<void> {
    if (role === TRole.admin) {
      await this.adminEntityRepository
        .createQueryBuilder()
        .update()
        .set({ lastLogin: new Date() })
        .where({ id: 1 })
        .execute();
    }
  }
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerEntityRepository: Repository<CustomerEntity>,

    @InjectRepository(AccountEntity)
    private accountEntityRepository: Repository<AccountEntity>,
  ) {}
}
