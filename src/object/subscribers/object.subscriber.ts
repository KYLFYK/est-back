import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

/* entities section */
import { ApartmentEntity } from '../entities/apartment.entity';
import { HouseEntity } from '../entities/house.entity';
import { TownhouseEntity } from '../entities/townhouse.entity';
import { LandEntity } from '../entities/land.entity';
import { ComplexEntity } from '../entities/complex.entity';
import { GuideEntity } from '../../guide/entities/guide.entity';
import { SetObjectsEntity } from '../entities/setObjects.entity';
/* */

class ObjectSubscriber implements EntitySubscriberInterface{

  async getOneGuide(event: any){
    return event.manager.getRepository(GuideEntity)
      .createQueryBuilder('guide')
      .where(`guide.type_en = 'objectType'`)
      .andWhere(`'${event.metadata.tableMetadataArgs.name}' = any(guide.for)`)
      .getRawOne()
  }

  async afterInsert(event: InsertEvent<any>) {
    // looking for guide
    const guide = await this.getOneGuide(event)

    /* create record in set_objects */
    event.manager.getRepository(SetObjectsEntity).save({
      objectType: guide.guide_id,
      objectId: event.entity.id
    })
    .catch(e => {
      throw new BadRequestException(e.message);
    });
    /* */
  }

  async afterRemove(event: RemoveEvent<any>) {
    // looking for guide
    const guide = await this.getOneGuide(event)
    /* delete record from set_objects */
    event.manager.getRepository(SetObjectsEntity)
      .createQueryBuilder()
      .delete()
      .where({
        objectType: guide.guide_id,
        objectId: event.entityId,
      })
      .execute()
      .catch(e => {
        throw new BadRequestException(e.message);
    })
    /* */
  }

}


@EventSubscriber()
export class ApartmentSubscriber extends ObjectSubscriber implements EntitySubscriberInterface<ApartmentEntity> {
  listenTo = () => ApartmentEntity;
}

@EventSubscriber()
export class HouseSubscriber extends ObjectSubscriber implements EntitySubscriberInterface<HouseEntity> {
  listenTo = () => HouseEntity;
}

@EventSubscriber()
export class TownhouseSubscriber extends ObjectSubscriber implements EntitySubscriberInterface<TownhouseEntity> {
  listenTo = () => TownhouseEntity;
}

@EventSubscriber()
export class LandSubscriber extends ObjectSubscriber implements EntitySubscriberInterface<LandEntity> {
  listenTo = () => LandEntity;
}

@EventSubscriber()
export class ComplexSubscriber extends ObjectSubscriber implements EntitySubscriberInterface<ComplexEntity> {
  listenTo = () => ComplexEntity;
}
