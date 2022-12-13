import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { IApartmentProperty } from '../interfaces/apartment/apartmentProperty.interface';

/* entities section */
import { BaseIdEntity } from '../../common/entities/base.entity';
import { ApartmentEntity } from '../../object/entities/apartment.entity';
/* */

import { TRooms } from '../types/rooms';

@Entity('apartment_property')
export class ApartmentPropertyEntity extends BaseIdEntity implements IApartmentProperty {

  @Column({ nullable: true })
  floor: number;

  @Column({ nullable: true })
  totalFloor: number;

  @Column({ type: 'float', nullable: true })
  area: number;

  @Column({ type: 'float', nullable: true })
  livingArea: number;

  @Column({ type: 'float', nullable: true })
  bathroomArea: number;

  @Column({ type: 'float', nullable: true })
  kitchenArea: number;

  @Column("float", { array: true, nullable: true })
  roomsArea: number[];

  @Column({ nullable: true })
  amountBedrooms: number;

  @Column({ nullable: true })
  amountShowers: number;

  @Column({ nullable: true })
  amountBathrooms: number;

  @Column({ nullable: true })
  buildingNumber: number;

  @Column({ type: 'float', nullable: true })
  heightCeilings: number;
  
  @Column({ nullable: true })
  deadline: Date;
  
  @Column({ nullable: true })
  interior: string;

  @Column({ nullable: true })
  infrastructure: string;
  
  @Column({
    type: 'enum',
    enum: TRooms,
    nullable: true,
  })
  rooms: TRooms;

  @Column({ nullable: true, length: 255 })
  threeD: string;

  @Column({ nullable: true, length: 255 })
  vr: string;

  @Column({ type: 'jsonb', nullable: true })
  constructionFeatures: object[];
}
