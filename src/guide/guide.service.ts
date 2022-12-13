import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* interfaces section */
import { IGuide } from './interfaces/guide.interface';
/* */

/* entities section */
import { GuideEntity } from './entities/guide.entity';
/* */

/* types section */
import { TType_en } from './types/type';
import { TFor } from './types/for';
/* */

/* dto section */
import { GuidePostBodyDto } from './dto/guide.post.dto';
import { GuidePutBodyDto } from './dto/guide.put.dto';
/* */

@Injectable()
export class GuideService {
  constructor(
    @InjectRepository(GuideEntity)
    private guideEntityRepository: Repository<GuideEntity>,
  ) {}

  /* READ */
  async getOne(id: IGuide['id']): Promise<GuideEntity>{
    return this.guideEntityRepository.findOne(id);
  }

  async getAll(): Promise<GuideEntity[]> {
    return this.guideEntityRepository.find();
  }

  async getByTypeByFor(t: TType_en, f: TFor): Promise<GuideEntity[]> {
    return this.guideEntityRepository
      .createQueryBuilder('guide')
      .where(`guide.type_en = '${t}'`)
      .andWhere(`'${f}' = any(guide.for)`)
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  /* 
    метод предназначен для проверки подходит ли массив с id к переданному объекту.
    Возвращает пересечение.
  */
  async getByForByIds(f: TFor, ids: IGuide[]): Promise<GuideEntity[]> {
    if (!ids || !f){
      return []
    }
    const result = await this.guideEntityRepository
      .createQueryBuilder('guide')
      .where(`'${f}' = any(guide.for)`)
      .andWhere(`id in (${ids})`)
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
    
    if (result.length === 0){
      throw new NotFoundException(`no one guide from array for ${f}`)
    }
    return result;
  }

  async getByTypeByValue(t: TType_en, v: string): Promise<GuideEntity> {

    return this.guideEntityRepository
      .createQueryBuilder('guide')
      .where(`guide.type_en = '${t}'`)
      .andWhere(`guide.value = '${v}'`)
      .getOne()
      .catch(e => {
        throw new BadRequestException(e.message);
      });

  }

  async getByFor(f: TFor): Promise<GuideEntity[]> {

    return this.guideEntityRepository
      .createQueryBuilder('guide')
      .where(`'${f}' = any(guide.for)`)
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async getByType(t: TType_en): Promise<GuideEntity[]> {
    return this.guideEntityRepository
      .createQueryBuilder('guide')
      .where(`guide.type_en = '${t}'`)
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async findOne(id: IGuide['id']): Promise<GuideEntity> {
    return this.guideEntityRepository.findOne(id);
  }
  /* */

  /* CREATE */
  async create(data: GuidePostBodyDto): Promise<GuideEntity> {
    return this.guideEntityRepository
      .save(data)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* */

  /* UPDATE */
  async update(foundData: GuideEntity, updateData: GuidePutBodyDto): Promise<GuideEntity> {

    const update = this.guideEntityRepository.merge(foundData, updateData);

    return this.guideEntityRepository
      .save(update)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* */

  /* DELETE */
  async delete(id: IGuide['id']): Promise<void> {
    await this.guideEntityRepository
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
