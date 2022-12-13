import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IAccount } from "src/account/interfaces/account.interface";
import { Repository } from "typeorm";
import { DeveloperPutBodyDto } from "../dto/developer/developer.put.dto";
import { DeveloperEntity } from "../entities/developer.entity";
import { IDeveloper } from "../interfaces/developer/developer.interface";

@Injectable()
export class DeveloperService {
  constructor(
    @InjectRepository(DeveloperEntity)
    private developerEntityRepository: Repository<DeveloperEntity>,
  ) {}

  async findOne(id: number | IDeveloper['id'] | IAccount['developerProperty']): Promise<DeveloperEntity> {
    return this.developerEntityRepository.findOne(Number(id), {
      relations: ['press']
    });
  }

  async update(foundData: DeveloperEntity, updateData: DeveloperPutBodyDto): Promise<DeveloperEntity>{
    const result = this.developerEntityRepository.merge(foundData, updateData);
    return this.developerEntityRepository
      .save(result)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* DELETE
  async updateStatistics(foundData: DeveloperEntity, updateData: any): Promise<any>{
    const result = this.developerEntityRepository.merge(foundData, updateData);
    return this.developerEntityRepository
        .save(result)
        .catch(e => {
            throw new BadRequestException(e.message);
        });
  }
  /* */

}