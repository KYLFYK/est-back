import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEntity } from '../entities/status.entity';

@Injectable()
export class StatusService {
    constructor(
        @InjectRepository(StatusEntity)
        private statusEntityRepository: Repository<StatusEntity>,
    ) {}

    async findAll(): Promise<StatusEntity[]>{
        return this.statusEntityRepository.find({
            order: {
                id: 'ASC'
            }
        })
    }
}
