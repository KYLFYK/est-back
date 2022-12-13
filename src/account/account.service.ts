import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { IAccount } from './interfaces/account.interface';
import { IAccountCreate } from './interfaces/account.interface.create';
import { AccountEntity } from './entities/account.entity';
import { AccountChangeBodyDto } from './dto/account.change.dto';

import { TRole } from './types/role';

import * as faker from 'faker';
import { plainToClass } from 'class-transformer';
import { DeveloperService } from '../account-property/services/developer.service';
import { AgentEntity } from '../account-property/entities/agent.entity';
import { AgentService } from '../account-property/services/agent.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountEntityRepository: Repository<AccountEntity>,
  ) {}

  @Inject()
  private developerService: DeveloperService;

  async findByEmail(email: IAccount['email']): Promise<AccountEntity> {
    return this.accountEntityRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findByPartEmail(email: string) {
    return this.accountEntityRepository.find({
      where: {
        email: Like('%'+email+'%')
      }
    })
  }

  async findByRole(role: IAccount['role'], take: number = null): Promise<AccountEntity[]> {
    let items = await this.accountEntityRepository.find({
      where: {
        role,
      },
      relations: [`${role}Property`,`${role}Property.file`],
    });

    if (!take){
      return items
    }
    if (items.length < take){
      return items
    }

    const random_array = [];
    for (let i = 1; i <= take; i++){
      let random_element = faker.random.arrayElement(items)
      random_array.push(random_element);
      items = items.filter(val => val !== random_element);
    }
    return random_array
  }

  async create( createData: IAccountCreate ): Promise<AccountEntity> {
    return this.accountEntityRepository
      .save(createData)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async findOne(id: number, role?: TRole): Promise<AccountEntity> {

    const relations = ['adminProperty', 'customerProperty', 'agentProperty', 'agencyProperty', 'developerProperty']

    if(role) {
      switch (role) {
        case TRole.admin:
          relations.push('adminProperty.file')
          break;
        case TRole.customer:
          relations.push('customerProperty.file')
          break;
        case TRole.agent:
          relations.push('agentProperty.file')
          break;
        case TRole.agency:
          relations.push('agencyProperty.file')
          break;
        case TRole.developer:
          relations.push('developerProperty.file')
          break;
      }
    }

    const account = await this.accountEntityRepository.findOne(id, {
      relations
    });

    if (!account){
      return account;
    }

    if (account.developerProperty){
      account.developerProperty = await this.developerService.findOne(account.developerProperty.id)
    }

    if (account.role){
      const pureAccount = Object.fromEntries(Object.entries(account).filter(([f]) => {
        return !f.endsWith('Property') || f === account.role + 'Property'
      }))

      if (pureAccount[account.role + 'Property'] && account[account.role + 'Property']){
        return plainToClass(AccountEntity, pureAccount)
      }
    }

    return account
  }

  async update(foundData: AccountEntity, updateData: AccountChangeBodyDto ): Promise<AccountEntity> {
    const update = this.accountEntityRepository.merge(foundData, updateData);

    return this.accountEntityRepository.save(update);
  }

  async updateRole(foundData: AccountEntity, role: TRole): Promise<AccountEntity> {
    const update = this.accountEntityRepository.merge(foundData, { role });

    return this.accountEntityRepository.save(update);
  }

  async mark(foundData: AccountEntity, markAsDelete: IAccount['markAsDelete']): Promise<AccountEntity> {
    const update = this.accountEntityRepository.merge(foundData, { markAsDelete });

    return this.accountEntityRepository.save(update);
  }

  async confirm(foundData: AccountEntity, isConfirmed: IAccount['isConfirmed']): Promise<AccountEntity>{
    const update = this.accountEntityRepository.merge(foundData, { isConfirmed });
    return this.accountEntityRepository.save(update)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async findNewUsers(dateFrom: Date, dateTo: Date): Promise<any>{

    dateTo.setDate(dateTo.getDate() + 1) // include last day

    return this.accountEntityRepository.find({
      where: {
        createAt: Between(dateFrom, dateTo),
      }
    })
    .catch(e => {
      throw new BadRequestException(e.message);
    });
  }
}
