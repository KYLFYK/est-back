import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ViewApplicationPostBodyDto, ViewApplicationPostResponseDto } from './dto/view-application.post.dto';
import { ViewApplicationEntity } from './entities/view-application.entity';
import { BaseObjectService } from '../object/services/baseObject.service';
import { IViewApplication } from './interfaces/view-application.interface';
import { ISetObjects } from '../object/interfaces/setObjects.interface';
import { IGuide } from '../guide/interfaces/guide.interface';

@Injectable()
export class ViewApplicationService {

  constructor(
    @InjectRepository(ViewApplicationEntity)
    private viewApplicationEntityRepository: Repository<ViewApplicationEntity>,
  ) {}

  @Inject()
  private readonly baseObjectService: BaseObjectService;


  /* READ */
  async findOne(id: IViewApplication['id']): Promise<ViewApplicationEntity> {
    return this.viewApplicationEntityRepository
      .createQueryBuilder('view_application')
      .leftJoinAndSelect('view_application.status', 'guide')
      .where(`view_application.id = ${id}`)
      .getOne()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async findByObjects(objects: IViewApplication['object'][]): Promise<ViewApplicationEntity[]> {
    return this.viewApplicationEntityRepository.find({
        relations: ['status'],
        where: {
          object: In(objects)
        }
      })
      .catch(e => {
        throw new BadRequestException(e.message);
      });
    return this.viewApplicationEntityRepository
      .createQueryBuilder('view_application')
      .leftJoinAndSelect('view_application.status', 'guide')
      .where(`view_application.object IN (:...objects)`, { objects })
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
    
  }

  async findByObject(object: ISetObjects['id']): Promise<ViewApplicationEntity> {
    return this.viewApplicationEntityRepository
      .createQueryBuilder('view_application')
      .leftJoinAndSelect('view_application.status', 'guide')
      .where(`view_application.object = ${object}`)
      .getOne()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
    
  }
  /* */

  /* CREATE */
  async create(
    data: ViewApplicationPostBodyDto,
    setObjects: ISetObjects,
    status: IGuide,
  ): Promise<ViewApplicationPostResponseDto> {

    delete data.status;

    let result = {
      object: setObjects,
      status: status,
    }
    result = Object.assign(result, data);

    const a = await this.viewApplicationEntityRepository
      .save(result)
      .catch(e => {
        throw new BadRequestException(e.message);
      });

    return {id: a.id};

  /* */
  }

  /* UPDATE */
  async mark(
    foundData: ViewApplicationEntity, 
    markAsDelete: IViewApplication['markAsDelete']
  ): Promise<ViewApplicationEntity> {
    const update = this.viewApplicationEntityRepository.merge(foundData, { markAsDelete });

    return this.viewApplicationEntityRepository
      .save(update)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* */
}
