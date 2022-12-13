import { Column, Entity, Index } from 'typeorm';
import { IGuide } from '../interfaces/guide.interface';
import { TType_en, TType_ru } from '../types/type';
import { TFor } from '../types/for';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { TSubtitle_en, TSubtitle_ru } from '../types/subtitle';

@Entity('guide')
export class GuideEntity extends BaseIdEntity implements IGuide {

  @Column({ length: 200, nullable: true })
  @Index()
  subtitle_en: string;

  @Column({ length: 200, nullable: true })
  subtitle_ru: string;

  @Column({ type: 'enum', enum: TType_en })
  @Index()
  type_en: TType_en;

  @Column({ type: 'enum', enum: TType_ru, nullable: true })
  type_ru: TType_ru;

  @Column('enum', { enum: TFor, array: true })
  @Index()
  for: TFor[];

  @Column({ type: 'boolean', nullable: true, default: false})
  isMulti: boolean

  @Column({ length: 200 })
  @Index()
  value: string;
}
