import { Column, Entity, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { BaseIdEntity } from '../../common/entities/base.entity';
import { IAgent } from '../interfaces/agent/agent.interface';
/* entities section*/
import { AgencyEntity } from './agency.entity';
import { FileEntity } from '../../file/entities/file.entity';
import { IFile } from '../../file/interfaces/IFile';
/* */

@Entity('agent')
export class AgentEntity extends BaseIdEntity implements IAgent {
  @ManyToMany(() => FileEntity, {
    cascade: true
  })
  @JoinTable({ name: 'agent_file' })
  file: IFile[];

  @Column({ length: 80, nullable: true })
    name: string;

  @Column({ length: 50, nullable: true })
    position: string;

  @Column({ type: 'jsonb', nullable: true })
    phone: object[];

  @Column({ nullable: true, type: 'date' })
    experience: Date;

  @Column({ nullable: true })
    rating: number;

  @Column({ length: 80, nullable: true, unique: true })
    inviteLink: string;

  @Column({ type: 'jsonb', nullable: true })
    messengers: Record<string, never>;

  @ManyToOne(() => AgencyEntity, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'agencyId', referencedColumnName: 'id' }])
  @Column({ nullable: true })
    agencyId: AgencyEntity;
}
