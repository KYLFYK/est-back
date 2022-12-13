import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { IComplex } from '../interfaces/complex/complex.interface';
import { ComplexEntity } from '../entities/complex.entity';
import { StatusEntity } from '../entities/status.entity';
import { AccountEntity } from '../../account/entities/account.entity';
import { BaseObjectService } from './baseObject.service';
import { ComplexBodyDto } from '../dto/complex/complex.body.dto';
import { GuideService } from '../../guide/guide.service';
import { TFor } from '../../guide/types/for';
import { plainToClass } from 'class-transformer';
import { ComplexPropertyEntity } from '../../object-property/entities/complexProperty.entity';
import { AccountService } from '../../account/account.service';
import { ApartmentEntity } from '../entities/apartment.entity';
import { IApartment } from '../interfaces/apartment/apartment.interface';
import { IApartmentProperty } from '../../object-property/interfaces/apartment/apartmentProperty.interface';
import { ConstructionProgressEntity } from '../../construction-progress/entities/construction-progress.entity';
import { FileService } from '../../file/file.service';
import { IFile } from '../../file/interfaces/IFile';
import { MinioClientService } from '../../minio-client/minio.client.service';
import { RegionEntity } from '../../region/entities/region.entity';
import { CountryEntity } from '../../country/entities/country.entity';
import { CityEntity } from '../../city/entities/city.entity';
import { FileEntity } from '../../file/entities/file.entity';


@Injectable()
export class ComplexService {
  constructor(
    private readonly minioClientService: MinioClientService,

    @InjectRepository(ComplexEntity)
    private complexEntityRepository: Repository<ComplexEntity>,

    @InjectRepository(ComplexPropertyEntity)
    private complexPropertyEntityRepository: Repository<ComplexPropertyEntity>,

    @InjectRepository(StatusEntity)
    private statusEntityRepository: Repository<StatusEntity>,

    @InjectRepository(AccountEntity)
    private accountEntityRepository: Repository<AccountEntity>,

    @InjectRepository(ApartmentEntity)
    private apartmentEntityRepository: Repository<ApartmentEntity>,

    @InjectRepository(RegionEntity)
    private regionEntityRepository: Repository<RegionEntity>,

    @InjectRepository(CountryEntity)
    private countryEntityRepository: Repository<CountryEntity>,

    @InjectRepository(CityEntity)
    private cityEntityRepository: Repository<CityEntity>,

    @InjectRepository(ConstructionProgressEntity)
    private constructionProgressEntityRepository: Repository<ConstructionProgressEntity>,

  ) {}

  @Inject()
  private baseObjectService: BaseObjectService;

  @Inject()
  private guideService: GuideService;

  @Inject()
  private fileService: FileService;

  @Inject()
  private accountService: AccountService;

  /* READ */
  async findAll(take: number = 10, skip: number = 0): Promise<ComplexEntity[]> {
    return await this.complexEntityRepository
      .createQueryBuilder('complex')
      .leftJoinAndSelect('complex.status', 'status')
      .leftJoinAndSelect('complex.owner', 'account')
      .leftJoinAndSelect('complex.guides', 'guide')
      .leftJoinAndSelect('complex.property', 'property')
      .leftJoinAndSelect('complex.constructionProgress', 'constructionProgress')
      .leftJoinAndSelect('complex.region', 'region')
      .leftJoinAndSelect('complex.country', 'country')
      .leftJoinAndSelect('complex.files', 'files')
      .orderBy('complex.id')
      .take(take)
      .skip(skip)
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async findOne(id: IComplex['id']): Promise<ComplexEntity> {

    const result = await this.complexEntityRepository.findOne(id, {
      relations: [
        'constructionProgress',
        'constructionProgress.file',
        'status',
        'guides',
        'property',
        'region',
        'owner',
        'files',
        'city',
        'country',
        'favorite'
      ],
      order: {
        id: 'ASC'
      }
    })
    .catch(e => {
      throw new BadRequestException(e.message);
    });

    if(!result) {
      throw new NotFoundException(`Complex by ${id} not found`)
    }

    // get account without excess properties
    if (result.owner){
      result.owner = await this.accountService.findOne(result.owner.id)
    }

    return result;
  }

  async findByOwner(owner: IComplex['owner']): Promise<ComplexEntity[]> {
    return this.complexEntityRepository
      .createQueryBuilder('complex')
      .leftJoinAndSelect('complex.status', 'status')
      .leftJoinAndSelect('complex.owner', 'account')
      .leftJoinAndSelect('complex.guides', 'guide')
      .leftJoinAndSelect('complex.constructionProgress', 'constructionProgress')
      .leftJoinAndSelect('complex.property', 'property')
      .leftJoinAndSelect('complex.region', 'region')
      .leftJoinAndSelect('complex.files', 'files')
      .where(`complex.owner = ${owner}`)
      .andWhere(`complex.status.id = 1`)
      .orderBy('complex.id')
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  // Метод ищет все квартиры, которые еще не сданы в ЖК
  async findPlanningByComplex(complexId: IComplex['id']) : Promise<{
    price: IApartment['price'],
    name: IApartment['name'],
    buildingNumber: IApartmentProperty['buildingNumber'],
    deadline: IApartmentProperty['deadline'],
    floor: IApartmentProperty['floor'],
    file: { id: IFile['id'], url: IFile['url']}[]
  }[]>{

    const query = await this.apartmentEntityRepository.find({
      where: {
        complex: complexId
      },
      relations: ['files', 'property']
    })
    .catch(e => {
      throw new BadRequestException(e.message);
    });

    if (!query){
      return []
    }

    const result = query.map(function(i) {
      return {
        id: i.id,
        price: i.price,
        name: i.name,
        buildingNumber: i.property.buildingNumber,
        deadline: i.property.deadline,
        floor: i.property.floor,
        file: i.files.map(function(f){
          return {
            id: f.id,
            url: f.url
          }
        })
      }
    })
    return result
  }
  /* */

  /* CREATE */
  async create(data: ComplexBodyDto): Promise<ComplexEntity> {

    data.property = plainToClass(ComplexPropertyEntity, data.property);
    data.guides = await this.guideService.getByForByIds(TFor.complex, data.guides);
    //data.file = await this.fileService.findByIds(data.file)
    //data.constructionProgress = await this.constructionProgressService.getByIds(data.constructionProgress);
    data.status = await this.baseObjectService.transformFromIdToObject(data.status, this.statusEntityRepository, `status id = ${data.status} not found`);
    data.owner = await this.baseObjectService.transformFromIdToObject(data.owner, this.accountEntityRepository, `owner id = ${data.owner} not found`);

    // start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try{

      /* save property */
      if (data.property){
        data.property = await queryRunner.manager
          .save(data.property)
          .catch(e => {
            throw new BadRequestException(e.message);
          });
      }
      else{
        data.property = null
      }
      /* */

      /* save readiness */
      if (data.readiness){
        data.readiness = plainToClass(FileEntity, data.readiness)
        data.readiness = await queryRunner.manager
          .save(data.readiness)
          .catch(e => {
            throw new BadRequestException(e.message);
          });
      }
      else{
        data.readiness = null
      }
      /* */

      /* save construction progress */
      if (!data.constructionProgress){
        data.constructionProgress = null
      }
      else if (data.constructionProgress.length <= 0){
        data.constructionProgress = null
      }
      else{
        data.constructionProgress = data.constructionProgress.map(function(obj){
          return plainToClass(ConstructionProgressEntity, obj)
        })

        await queryRunner.manager
          .save(data.constructionProgress)
          .catch(e => {
            throw new BadRequestException(e.message);
          });
      }
      /* */

      const files = []
      if (data.files.length > 0) {
        for (const file of data.files) {
          files.push(await this.fileService.saveFile({
            fileName: file['fileName'],
            url: file['url'],
            mimeType: file['mimeType'],
            size: file.size,
          }))
        }
      }
      data.files = files;

      /* save complex */
      const result = await queryRunner.manager
        .save(plainToClass(ComplexEntity, data))
        .catch(e => {
          throw new BadRequestException(e.message);
        });
      /* */

      await queryRunner.commitTransaction();
      return plainToClass(ComplexEntity, result)
    }

    catch(e){
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message)
    }
    finally {
      await queryRunner.release();
    }

  }
  /* */

  /* UPDATE */
  async mark(foundData: ComplexEntity, markAsDelete: IComplex['markAsDelete']): Promise<ComplexEntity> {
    const update = this.complexEntityRepository.merge(foundData, { markAsDelete });

    return this.complexEntityRepository
      .save(update)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async update(foundDataComplex: ComplexEntity, updateDataComplex: ComplexBodyDto): Promise<ComplexEntity> {

    /* files */
    if (foundDataComplex.files){
      if (foundDataComplex.files.length > 0){
        for (const file of foundDataComplex.files){
          await this.fileService.deleteFile(file)
          // await this.minioClientService.delete(file['fileName'])
        }
      }
    }
    // if (updateDataComplex.files){
    //   if (updateDataComplex.files.length > 0){
    //     for (const file in updateDataComplex.files){
    //       updateDataComplex.files[file] =  await this.fileService.saveFile({
    //         fileName: updateDataComplex.files[file].fileName,
    //         url: updateDataComplex.files[file].url,
    //         mimeType: updateDataComplex.files[file].mimeType,
    //         size: updateDataComplex.files[file].size,
    //       })
    //     }
    //   }
    // }
    /* */

    /* readiness */
    if (foundDataComplex.readiness){
      await this.fileService.deleteFile(foundDataComplex.readiness)
      // await this.minioClientService.delete(foundDataComplex.readiness['fileName'])
    }
    if (updateDataComplex.readiness){
        updateDataComplex.readiness = await this.fileService.saveFile({
          fileName: updateDataComplex.readiness.fileName,
          url: updateDataComplex.readiness.url,
          mimeType: updateDataComplex.readiness.mimeType,
          size: updateDataComplex.readiness.size,
        })
    }
    /* */

    /* property */
    if (updateDataComplex.property === null){
      await this.complexPropertyEntityRepository
        .remove(updateDataComplex.property['id'])
        .catch(e => {
          throw new BadRequestException(e.message);
        });
    }
    else if (updateDataComplex.property){
      if (Object.keys(updateDataComplex.property).length > 0){
        const foundProperty = this.complexPropertyEntityRepository.merge(foundDataComplex.property, updateDataComplex.property);
        updateDataComplex.property = await this.complexPropertyEntityRepository
          .save(foundProperty)
          .catch(e => {
            throw new BadRequestException(e.message);
          });
      }
    }
    /* */

    /* construction progress */
    if (updateDataComplex.constructionProgress){
      updateDataComplex.constructionProgress = await this.constructionProgressEntityRepository.save(updateDataComplex.constructionProgress);
      if (foundDataComplex.constructionProgress){
        for (const cp of foundDataComplex.constructionProgress){
          await this.constructionProgressEntityRepository.remove(cp)
        }
      }
    }
    /* */

    const result = this.complexEntityRepository.merge(foundDataComplex, updateDataComplex);

    if (updateDataComplex.guides !== undefined){
      result.guides = await this.guideService.getByForByIds(TFor.complex, updateDataComplex.guides);
    }
    result.files = updateDataComplex.files;
    result.status = await this.baseObjectService.transformFromIdToObject(updateDataComplex.status, this.statusEntityRepository, `status id = ${updateDataComplex.status} not found`);
    result.country = await this.baseObjectService.transformFromIdToObject(updateDataComplex.country, this.countryEntityRepository, `country id = ${updateDataComplex.country} not found`);
    result.region = await this.baseObjectService.transformFromIdToObject(updateDataComplex.region, this.regionEntityRepository, `region id = ${updateDataComplex.region} not found`);
    result.city = await this.baseObjectService.transformFromIdToObject(updateDataComplex.city, this.cityEntityRepository, `city id = ${updateDataComplex.city} not found`);
    result.owner = foundDataComplex.owner

    return this.complexEntityRepository
    .save(result)
    .catch(e => {
      throw new BadRequestException(e.message);
    });

  }
  /* */

  /* DELETE */
  async delete(id: IComplex['id']): Promise<void> {
    const find = await this.findOne(id);

    if (!find) {
      throw new NotFoundException(`id = ${id} not found`);
    }

    // start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // delete 2 entities
    try{

      if (find.property){
        await queryRunner.manager
          .remove(find.property)
          .catch(e => {
            throw new BadRequestException(e.message);
          });
      }

      await queryRunner.manager
        .remove(find)
        .catch(e => {
          throw new BadRequestException(e.message);
        });

      await queryRunner.commitTransaction();
    }

    catch(e){
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message)
    }
    finally {
      await queryRunner.release();
    }
  }
  /* */

}

