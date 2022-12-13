import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nestedProperty from 'nested-property';
import { ITownhouse } from '../interfaces/townhouse/townhouse.interface';
import { TownhouseEntity } from '../entities/townhouse.entity';
import { ComplexEntity } from '../entities/complex.entity';
import { StatusEntity } from '../entities/status.entity';
import { AccountEntity } from '../../account/entities/account.entity';
import { GuideEntity } from '../../guide/entities/guide.entity';
import { BaseObjectService } from './baseObject.service';
import { TownhouseBodyDto } from '../dto/townhouse/townhouse.body.dto';
import { TFor } from '../../guide/types/for';
import { GuideService } from '../../guide/guide.service';
import { CustomerEntity } from '../../account-property/entities/customer.entity';
import { AgentEntity } from '../../account-property/entities/agent.entity';
import { LegalPurityEntity } from '../../leagal-purity/entities/legalPurity.entity';
import { TownhousePropertyEntity } from '../../object-property/entities/townhouseProperty.entity';
import { FileService } from '../../file/file.service';
import { MinioClientService } from '../../minio-client/minio.client.service';
import { RegionEntity } from '../../region/entities/region.entity';
import { CountryEntity } from '../../country/entities/country.entity';
import { CityEntity } from '../../city/entities/city.entity';


@Injectable()
export class TownhouseService {
  constructor(
    private readonly minioClientService: MinioClientService,

    @InjectRepository(TownhouseEntity)
    private townhouseEntityRepository: Repository<TownhouseEntity>,

    @InjectRepository(TownhousePropertyEntity)
    private townhousePropertyEntity: Repository<TownhousePropertyEntity>,

    @InjectRepository(ComplexEntity)
    private complexEntityRepository: Repository<ComplexEntity>,

    @InjectRepository(StatusEntity)
    private statusEntityRepository: Repository<StatusEntity>,

    @InjectRepository(AccountEntity)
    private accountEntityRepository: Repository<AccountEntity>,

    @InjectRepository(AgentEntity)
    private agentEntityRepository: Repository<AgentEntity>,

    @InjectRepository(CustomerEntity)
    private customerEntityRepository: Repository<CustomerEntity>,

    @InjectRepository(LegalPurityEntity)
    private legalPurityEntityRepository: Repository<LegalPurityEntity>,

    @InjectRepository(RegionEntity)
    private regionEntityRepository: Repository<RegionEntity>,

    @InjectRepository(CountryEntity)
    private countryEntityRepository: Repository<CountryEntity>,

    @InjectRepository(CityEntity)
    private cityEntityRepository: Repository<CityEntity>,
  ) {}

  @Inject()
  private baseObjectService: BaseObjectService;

  @Inject()
  private guideService: GuideService;

  @Inject()
  private fileService: FileService;

  /* READ */
  async findAll(take: number = 10, skip: number = 0): Promise<TownhouseEntity[]> {
    return this.townhouseEntityRepository
      .createQueryBuilder('townhouse')
      .where(`townhouse.id in (Select townhouse.id from townhouse limit ${take} offset ${skip})`)
      .leftJoinAndSelect('townhouse.status', 'status')
      .leftJoinAndSelect('townhouse.owner', 'account')
      .leftJoinAndSelect('townhouse.guides', 'guide')
      .leftJoinAndSelect('townhouse.region', 'region')
      .leftJoinAndSelect('townhouse.files', 'files')
      .orderBy('townhouse.id')
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async findOne(id: ITownhouse['id']): Promise<TownhouseEntity> {
    const result = await this.townhouseEntityRepository.findOne(id, {
      relations: [
        'status',
        'guides',
        'property',
        'region',
        'city',
        'country',
        'owner',
        'files',
        'legalPurity',
        'favorite'
      ],
      order: {
        id: 'ASC'
      }
    })
    .catch(e => {
      throw new BadRequestException(e.message);
    });
    if (nestedProperty.get(result, 'owner.agentProperty')){
      result.owner.agentProperty = await this.agentEntityRepository.findOne(result.owner.agentProperty, {
        relations: ['agencyId']
      })
    }
    else if (nestedProperty.get(result, 'owner.customerProperty')){
      result.owner.customerProperty = await this.customerEntityRepository.findOne(result.owner.customerProperty)
    }
    return result
  }


  async findByComplex(id: ITownhouse['complex']): Promise<TownhouseEntity[]> {
    return this.townhouseEntityRepository
      .createQueryBuilder('townhouse')
      .leftJoinAndSelect('townhouse.status', 'status')
      .leftJoinAndSelect('townhouse.owner', 'account')
      .leftJoinAndSelect('townhouse.guides', 'guide')
      .leftJoinAndSelect('townhouse.region', 'region')
      .where(`townhouse.complex = ${id}`)
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* */

  /* CREATE */
  async create(data: TownhouseBodyDto): Promise<TownhouseEntity> {

    data.guides = await this.guideService.getByForByIds(TFor.townhouse, data.guides);
    data.status = await this.baseObjectService.transformFromIdToObject(data.status, this.statusEntityRepository, `status id = ${data.status} not found`);
    data.owner = await this.baseObjectService.transformFromIdToObject(data.owner, this.accountEntityRepository, `owner id = ${data.owner} not found`);
    data.complex = await this.baseObjectService.transformFromIdToObject(data.complex, this.complexEntityRepository, `complex id = ${data.complex} not found`);

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

    await this.legalPurityEntityRepository.save(data.legalPurity);
    await this.townhousePropertyEntity.save(data.property);

    return this.townhouseEntityRepository
      .save(data)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* */

  /* UPDATE */
  async mark(foundData: TownhouseEntity, markAsDelete: ITownhouse['markAsDelete']): Promise<TownhouseEntity> {
    const update = this.townhouseEntityRepository.merge(foundData, { markAsDelete });

    return this.townhouseEntityRepository
      .save(update)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  async update(foundData: TownhouseEntity, updateData: TownhouseBodyDto): Promise<TownhouseEntity> {

    /* files */
    if (foundData.files){
      if (foundData.files.length > 0){
        for (const file of foundData.files){
          await this.fileService.deleteFile(file)
          // await this.minioClientService.delete(file['fileName'])
        }
      }
    }

    // if (updateData.files){
    //   if (updateData.files.length > 0){
    //     for (const file in updateData.files){
    //       updateData.files[file] =  await this.fileService.saveFile({
    //         fileName: updateData.files[file].fileName,
    //         url: updateData.files[file].url,
    //         mimeType: updateData.files[file].mimeType,
    //         size: updateData.files[file].size,
    //       })
    //     }
    //   }
    // }
    /* */

    /* property */
    if (updateData.property === null){
      await this.townhousePropertyEntity
        .remove(updateData.property['id'])
        .catch(e => {
          throw new BadRequestException(e.message);
        });
    }
    else if (updateData.property){
      if (Object.keys(updateData.property).length > 0){
        const foundProperty = this.townhousePropertyEntity.merge(foundData.property, updateData.property);
        updateData.property = await this.townhousePropertyEntity
          .save(foundProperty)
          .catch(e => {
            throw new BadRequestException(e.message);
          });
      }
    }
    /* */

    /* legal purity */
    if (updateData.legalPurity === null){
      if (foundData.legalPurity){
        await this.legalPurityEntityRepository.remove(foundData.legalPurity)
        foundData.legalPurity = null
      }
    }
    else if (updateData.legalPurity){
      const foundLegalPurity = await this.legalPurityEntityRepository.merge(foundData.legalPurity, updateData.legalPurity);
      foundData.legalPurity = await this.legalPurityEntityRepository.save(foundLegalPurity);
    }
    /* */

    const result = this.townhouseEntityRepository.merge(foundData, updateData);
    result.files = updateData.files;
    result.guides = await this.guideService.getByForByIds(TFor.house, updateData.guides);
    result.status = await this.baseObjectService.transformFromIdToObject(updateData.status, this.statusEntityRepository, `status id = ${updateData.status} not found`);
    result.complex = await this.baseObjectService.transformFromIdToObject(updateData.complex, this.complexEntityRepository, `complex id = ${updateData.complex} not found`);
    result.country = await this.baseObjectService.transformFromIdToObject(updateData.country, this.countryEntityRepository, `country id = ${updateData.country} not found`);
    result.region = await this.baseObjectService.transformFromIdToObject(updateData.region, this.regionEntityRepository, `region id = ${updateData.region} not found`);
    result.city = await this.baseObjectService.transformFromIdToObject(updateData.city, this.cityEntityRepository, `city id = ${updateData.city} not found`);
    result.owner = foundData.owner

    return this.townhouseEntityRepository
      .save(result)
      .catch(e => {
        throw new BadRequestException(e.message);
      });

  }
  /* */

  /* DELETE */
  async delete(id: ITownhouse['id']): Promise<void> {

    const find = await this.findOne(id);

    if (!find) {
      throw new NotFoundException(`id = ${id} not found`);
    }

    this.townhouseEntityRepository
      .remove(find)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  /* */

}
