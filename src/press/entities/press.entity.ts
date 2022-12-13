import { Entity, Column} from 'typeorm';

import { BaseIdEntity } from '../../common/entities/base.entity';
import { IPress } from '../interfaces/press.interface';

@Entity('press')
export class PressEntity extends BaseIdEntity implements IPress {

    @Column({ nullable: true })
    date: Date;

    @Column()
    link: string;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    logo: string;
}
