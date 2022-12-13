import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComplexEntity } from '../object/entities/complex.entity';
import { IComplex } from '../object/interfaces/complex/complex.interface';
import { Repository } from 'typeorm';
import { ConstructionProgressGetResponseDto } from './dto/construction-progress.get.dto';
import { ConstructionProgressPostBodyDto } from './dto/construction-progress.post.dto';
import { ConstructionProgressPutBodyDto } from './dto/construction-progress.put.dto';
import { ConstructionProgressEntity } from './entities/construction-progress.entity';
import { IConstructionProgress } from './interfaces/construction-progress.interface';

@Injectable()
export class ConstructionProgressService {
    constructor(
        @InjectRepository(ConstructionProgressEntity)
        private constructionProgressEntityRepository: Repository<ConstructionProgressEntity>,

        @InjectRepository(ComplexEntity)
        private complexEntityRepository: Repository<ComplexEntity>,
    ) {}
    
    /* READ */
    async findByComplex(complex: IComplex['id'] | number): Promise<ConstructionProgressEntity[]> {
        return this.constructionProgressEntityRepository
            .createQueryBuilder('construction_progress')
            .leftJoinAndSelect('construction_progress.complex', 'complex')
            .where(`construction_progress.complex = ${complex}`)
            .getMany()
            .catch(e => {
                throw new BadRequestException(e.message);
            });
    }

    async findOne(id: IConstructionProgress['id']): Promise<ConstructionProgressEntity> {
        return this.constructionProgressEntityRepository
            .createQueryBuilder('construction_progress')
            .where(`construction_progress.id = ${id}`)
            .getOne()
            .catch(e => {
                throw new BadRequestException(e.message);
            });
    }

    async getByIds(ids: IConstructionProgress[]): Promise<ConstructionProgressEntity[]> {
        if (!ids){
          return []
        }
        const result = await this.constructionProgressEntityRepository
          .createQueryBuilder('constructionProgress')
          .where(`id in (${ids})`)
          .getMany()
          .catch(e => {
            throw new BadRequestException(e.message);
          });
        
        return result;
      }
    /* */

    /* CREATE */
    async create(data: ConstructionProgressPostBodyDto): Promise<ConstructionProgressGetResponseDto> {
        return this.constructionProgressEntityRepository
            .save(data)
            .catch(e => {
                throw new BadRequestException(e.message);
            });
    }
    /* */
    
    /* UPDATE */
    async update(foundData: ConstructionProgressEntity, updateData: ConstructionProgressPutBodyDto): Promise<ConstructionProgressGetResponseDto> {

        const update = this.constructionProgressEntityRepository.merge(foundData, updateData);

        return this.constructionProgressEntityRepository
            .save(update)
            .catch(e => {
                throw new BadRequestException(e.message);
            });
                     
    }
    /* */

    /* DELETE */
    async delete(id: IConstructionProgress['id']): Promise<void> {
        await this.constructionProgressEntityRepository
            .createQueryBuilder()
            .delete()
            .where({ id })
            .execute()
            .catch(e => {
                throw new BadRequestException(e.message);
            });
    }
    /* */    
}
