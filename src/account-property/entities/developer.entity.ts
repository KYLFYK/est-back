import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { IDeveloper } from '../interfaces/developer/developer.interface';
import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';
import { PressEntity } from '../../press/entities/press.entity';
import { IPress } from '../../press/interfaces/press.interface';

@Entity('developer')
export class DeveloperEntity extends BaseIdEntity implements IDeveloper {
  @ManyToMany(() => FileEntity, {
    cascade: true
  })
  @JoinTable({ name: 'developer_file' })
  file: IFile[];

  @ManyToMany(() => PressEntity)
  @JoinTable({ name: 'developer_press' })
  press: IPress[];

  @Column({ length: 50, nullable: true })
  name: string;

  @Column({ length: 30, nullable: true })
  type: string;

  @Column({ nullable: true })
  completedComplexAmount: number;

  @Column({ nullable: true })
  completedBuildingAmount: number;

  @Column({ nullable: true })
  inProgressComplexAmount: number;

  @Column({ nullable: true })
  inProgressBuildingAmount: number;

  @Column({ length: 255, nullable: true })
  logo: string;

  @Column({ type: 'jsonb', nullable: true })
  phone: Array<Record<string, never>>;

  @Column({ length: 200, nullable: true })
  address: string;

  @Column({ length: 255, nullable: true })
  site: string;

  @Column({ nullable: true })
  description: string;

  //@Column({ type: "float", default: 0, nullable: true })
  //experience: number;

  @Column({ length: 200, nullable: true })
  legalFullName: string;

  @Column({ length: 200, nullable: true })
  legalAddress: string;

  @Column({ type: 'float', nullable: true })
  authorizedCapital: number;

  @Column({ nullable: true })
  OKFS: string;

  @Column({ nullable: true })
  OKOPF: string;

  @Column({ nullable: true })
  OKOGU: string;

  @Column({ nullable: true, length: 12, unique: true })
  INN: string;

  @Column({ nullable: true, length: 13, unique: true })
  OGRN: string;

  @Column({ nullable: true, length: 9, unique: true })
  KPP: string;

  @Column({ nullable: true, length: 20 })
  OKATO: string;

  @Column({ nullable: true, length: 10, unique: true })
  OKPO: string;

  @Column({ nullable: true, length: 11, unique: true })
  OKTMO: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true, length: 80 })
  leaderName: string;

  @Column({ nullable: true })
  founders: string;

  @Column({ nullable: true })
  enterpriseSize: number;

  @Column({ nullable: true })
  numberOfStaff: number;

  @Column({ nullable: true })
  branch: number;

  @Column({ type: 'float', nullable: true })
  revenue: number;

  @Column({ type: 'float', nullable: true })
  netProfit: number;

  @Column({ type: 'float', nullable: true })
  netAssets: number;

  @Column({ nullable: true, type: 'date' })
  registrationDate: Date;

  @Column({ nullable: true })
  registrationAuthorityName: string;

  @Column({ length: 200, nullable: true })
  registrationAuthorityAddress: string;

  @Column({ nullable: true })
  registeringAuthorityLocated: string;

  @Column({ nullable: true })
  mainOccupation: string;

  @Column({ type: 'jsonb', nullable: true })
  extraOccupations: Array<Record<string, never>>;

  @Column({ type: 'jsonb', nullable: true })
  statistics: Array<Record<string, never>>;

  @Column({ type: 'jsonb', nullable: true })
  risks: Array<Record<string, never>>;

}
