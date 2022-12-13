import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadsEntity } from './entities/leads.entity';
import { LeadCreateDto } from './dto/lead.create.dto';
import { EarlyPaymentEntity } from './entities/early.payment.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(LeadsEntity)
    private leadsEntityRepository: Repository<LeadsEntity>,
    @InjectRepository(EarlyPaymentEntity)
    private earlyPaymentEntityRepository: Repository<EarlyPaymentEntity>
  ) {}

  async getAll(): Promise<any> {
    return await this.leadsEntityRepository.find({relations: ['earlyPayment']})
  }

  async getOne(id: number): Promise<any> {
    return await this.leadsEntityRepository.findOne(id, {relations: ['earlyPayment']})
  }

  async setOne(data: LeadCreateDto): Promise<any> {
    await this.earlyPaymentEntityRepository.save(data.earlyPayment);
    return this.leadsEntityRepository.save(data);
  }

  async updateOne(data: Partial<Omit<LeadsEntity, 'id' | 'createAt'>>, id: number) {
    const foundData = await this.leadsEntityRepository.findOne(id);

    if(!foundData) {
      throw new NotFoundException(`id = ${id} not found`);
    }

    const updateData = await this.leadsEntityRepository.merge(foundData, data);

    return await this.leadsEntityRepository.save(updateData);
  }

  async deleteOne(id: number): Promise<any> {
    return await this.leadsEntityRepository.delete(id)
  }

}
