import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { IHouseProperty } from '../interfaces/house/houseProperty.interface';

/* entities section */
import { BaseIdEntity } from '../../common/entities/base.entity';
import { HouseEntity } from '../../object/entities/house.entity';
/* */

import { TRooms } from '../types/rooms';

@Entity('house_property')
export class HousePropertyEntity extends BaseIdEntity implements IHouseProperty {

  @Column({ nullable: true })
  totalFloor: number;

  @Column({ type: 'float', nullable: true })
  totalArea: number;

  @Column({ type: 'float', nullable: true })
  area: number;

  @Column({ type: 'float', nullable: true })
  landArea: number;

  @Column({ type: 'float', nullable: true })
  livingArea: number;

  @Column({ type: 'float', nullable: true })
  bathroomArea: number;

  @Column({ type: 'float', nullable: true })
  kitchenArea: number;

  @Column({ nullable: true })
  amountBedrooms: number;

  @Column({ nullable: true })
  amountShowers: number;

  @Column({ nullable: true })
  amountBathrooms: number;
  
  @Column({ nullable: true })
  infrastructure: string;

  @Column({
    type: 'enum',
    enum: TRooms,
    nullable: true,
  })
  rooms: TRooms;

  @Column({ type: 'jsonb', nullable: true })
  floors: object[];

  @Column({ nullable: true, length: 255 })
  threeD: string;

  @Column({ nullable: true, length: 255 })
  vr: string;

  @Column({ type: 'jsonb', nullable: true })
  constructionFeatures: object[];
}
