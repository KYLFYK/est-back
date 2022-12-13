import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IAccount } from "src/account/interfaces/account.interface";
import { Repository } from "typeorm";
import { AgentPutBodyDto } from "../dto/agent/agent.put.dto";
import { AgentEntity } from "../entities/agent.entity";
import { IAgent } from "../interfaces/agent/agent.interface";

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(AgentEntity)
    private agentEntityRepository: Repository<AgentEntity>,
  ) {}

  async findOne(id: number | IAgent['id'] | IAccount['agentProperty']): Promise<AgentEntity> {
    return this.agentEntityRepository.findOne(Number(id), {
      relations: ['agencyId']
    });
  }

  async update(foundData: AgentEntity, updateData: AgentPutBodyDto): Promise<AgentEntity>{
    console.log(foundData, updateData)
    const result = await this.agentEntityRepository.merge(foundData, updateData);

    return await this.agentEntityRepository
      .save(result)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
}
