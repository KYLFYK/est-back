import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IAccount } from "src/account/interfaces/account.interface";
import { Repository } from "typeorm";
import { AgencyPutBodyDto } from "../dto/agency/agency.put.dto";
import { AgentPutBodyDto } from "../dto/agent/agent.put.dto";
import { AgencyEntity } from "../entities/agency.entity";
import { AgentEntity } from "../entities/agent.entity";
import { IAgency } from "../interfaces/agency/agency.interface";

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(AgencyEntity)
    private agencyEntityRepository: Repository<AgencyEntity>,
  ) {}

  async findOne(id: number | IAgency['id'] | IAccount['agencyProperty']): Promise<AgencyEntity> {
    return this.agencyEntityRepository.findOne(Number(id));
  }

  async update(foundData: AgencyEntity, updateData: AgencyPutBodyDto): Promise<AgencyEntity>{
    const result = this.agencyEntityRepository.merge(foundData, updateData);
    return this.agencyEntityRepository
      .save(result)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
}