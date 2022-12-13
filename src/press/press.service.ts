import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { DeveloperEntity } from '../account-property/entities/developer.entity';
import { IDeveloper } from '../account-property/interfaces/developer/developer.interface';
import { getConnection, Repository } from 'typeorm';
import { PressPostBodyDto, PressPostResponseDto } from './dto/press.post.dto';
import { PressPutBodyDto } from './dto/press.put.dto';
import { PressEntity } from './entities/press.entity';
import { IPress } from './interfaces/press.interface';

@Injectable()
export class PressService {
    
    constructor(
        @InjectRepository(PressEntity)
        private pressEntityRepository: Repository<PressEntity>,

        @InjectRepository(DeveloperEntity)
        private developerEntityRepository: Repository<DeveloperEntity>,        
    ) {}
    
    /* READ */
    async findById(id: IPress['id']): Promise<PressEntity>{
        return this.pressEntityRepository.findOne(id)
    }

    async findByDeveloper(id: IDeveloper['id']): Promise<PressEntity[]>{
        const developer = await this.developerEntityRepository.findOne(id, {
            relations: ['press']
        })
        
        return developer.press
    }
    /* */

    /* CREATE */
    async createOne(
        data: PressPostBodyDto, 
        developerId: IDeveloper['id']
    ): Promise<PressPostResponseDto> {
        
        const developer = await this.developerEntityRepository.findOne(developerId, {
            relations: ['press']
        })
        
        data = plainToClass(PressEntity, data);

        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try{
            
            const press = await queryRunner.manager
                .save(data)
                .catch(e => {
                    throw new BadRequestException(e.message);
                });
            
            developer.press.push(plainToClass(PressEntity, press))
            
            await queryRunner.manager
                .save(developer)
                .catch(e => {
                    throw new BadRequestException(e.message);
                })
            
            await queryRunner.commitTransaction();
            return plainToClass(PressPostResponseDto, press)
        }
        catch(e){
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(e.message)
        }
        finally{
            await queryRunner.release();
        }
    }

    async createSome(
        data: PressPostBodyDto[], 
        developerId: IDeveloper['id']
    ): Promise<PressPostResponseDto[]> {
        
        const developer = await this.developerEntityRepository.findOne(developerId, {
            relations: ['press']
        })        

        data = plainToClass(PressEntity, data);
        
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try{
            
            const press = await queryRunner.manager
                .save(data)
                .catch(e => {
                    throw new BadRequestException(e.message);
                });

            developer.press = [...developer.press, ...plainToClass(PressEntity, press)]
            
            await queryRunner.manager
                .save(developer)
                .catch(e => {
                    throw new BadRequestException(e.message);
                })
            
            await queryRunner.commitTransaction();
            return plainToClass(PressPostResponseDto, developer.press)
            
        }
        catch(e){
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(e.message)
        }
        finally{
            await queryRunner.release();
        }
        
    }    
    /* */

    /* UPDATE */
    async update(foundData: PressEntity, updateData: PressPutBodyDto): Promise<PressEntity> {
        const result = this.pressEntityRepository.merge(foundData, updateData);
        return this.pressEntityRepository
            .save(result)
            .catch(e => {
                throw new BadRequestException(e.message);
            });
    }
    /* */

    /* DELETE */
    async delete(id: IPress['id']): Promise<void> {
        const find = await this.pressEntityRepository.findOne(id);

        if (!find) {
            throw new NotFoundException(`id = ${id} was not found`);
        }
      
        await this.pressEntityRepository
            .remove(find)
            .catch(e => {
                throw new BadRequestException(e.message);
            });
    }
    /* */
}
