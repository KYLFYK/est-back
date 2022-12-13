import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IBaseInterface, IBaseIdInterface } from '../interfaces/base.interface';

export class BaseEntity implements IBaseInterface {
  @PrimaryGeneratedColumn()
    id: number;

  @CreateDateColumn()
    createAt: Date;

  @UpdateDateColumn()
    updateAt: Date;
}

export class BaseIdEntity implements IBaseIdInterface {
  @PrimaryGeneratedColumn()
    id: number;
}
