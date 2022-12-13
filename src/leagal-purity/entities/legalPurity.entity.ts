import {
  BaseEntity,
  Column,
  CreateDateColumn, Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ILegalPurity } from '../interfaces/ILegalPurity';
import { GuideEntity } from '../../guide/entities/guide.entity';
import { BaseIdEntity } from '../../common/entities/base.entity';

@Entity('legal_purity')
export class LegalPurityEntity extends BaseIdEntity implements ILegalPurity {

  @Column()
  address: string;

  @Column()
  areaUnits: string;

  @Column({type: 'float'})
  areaValue: number;

  @Column()
  cadastalNumber: string;

  @Column()
  cadastralPrice: number;

  @Column()
  currentOwnerName: string;

  @Column()
  currentOwnerStartDate: Date;

  @Column({nullable: true})
  floor: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  previewOwners: {
    owners: any[],
    startDate: Date,
    finishDate: Date
  };

  @Column({ type: 'jsonb', nullable: true })
  encumbrances: {
    title: string;
    description: string,
    status: boolean
  }[];

  @Column({ type: 'jsonb', nullable: true })
  recomendations: {
    title: string;
    description: string
  }[];

}
