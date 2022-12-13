import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IHouse } from '../interfaces/house/house.interface';
import { HouseEntity } from '../entities/house.entity';
import { ComplexEntity } from '../entities/complex.entity';
import { StatusEntity } from '../entities/status.entity';
import { AccountEntity } from '../../account/entities/account.entity';
import { BaseObjectService } from './baseObject.service';
import { GuideService } from '../../guide/guide.service';
import { HouseBodyDto } from '../dto/house/house.body.dto';
import { TFor } from '../../guide/types/for';
import * as nestedProperty from 'nested-property';
import { AgentEntity } from '../../account-property/entities/agent.entity';
import { CustomerEntity } from '../../account-property/entities/customer.entity';
import { HousePropertyEntity } from '../../object-property/entities/houseProperty.entity';
import { LegalPurityEntity } from '../../leagal-purity/entities/legalPurity.entity';
import { FileService } from '../../file/file.service';
import { MinioClientService } from '../../minio-client/minio.client.service';
import { RegionEntity } from '../../region/entities/region.entity';
import { CountryEntity } from '../../country/entities/country.entity';
import { CityEntity } from '../../city/entities/city.entity';

@Injectable()
export class HouseService {
  constructor(
    private readonly minioClientService: MinioClientService,

    @InjectRepository(HouseEntity)
    private houseEntityRepository: Repository<HouseEntity>,

    @InjectRepository(HousePropertyEntity)
    private housePropertyEntity: Repository<HousePropertyEntity>,

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
  async findAll(take: number = 10, skip: number = 0): Promise<HouseEntity[]> {

    return this.houseEntityRepository
      .createQueryBuilder('house')
      .where(`house.id in (Select house.id from house limit ${take} offset ${skip})`)
      .leftJoinAndSelect('house.status', 'status')
      .leftJoinAndSelect('house.owner', 'account')
      .leftJoinAndSelect('house.guides', 'guide')
      .leftJoinAndSelect('house.region', 'region')
      .leftJoinAndSelect('house.country', 'country')
      .leftJoinAndSelect('house.files', 'files')
      .orderBy('house.id')
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async findOne(id: IHouse['id']): Promise<HouseEntity> {
    const result = await this.houseEntityRepository.findOne(id, {
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

  async findByComplex(id: IHouse['complex']): Promise<HouseEntity[]> {
    return this.houseEntityRepository
      .createQueryBuilder('house')
      .leftJoinAndSelect('house.status', 'status')
      .leftJoinAndSelect('house.owner', 'account')
      .leftJoinAndSelect('house.guides', 'guide')
      .leftJoinAndSelect('house.region', 'region')
      .where(`house.complex = ${id}`)
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async findByOwner(owner: IHouse['owner']): Promise<HouseEntity[]> {
    return this.houseEntityRepository.find({
      relations: [
        'guides',
        'property',
        'region',
        'city',
        'owner',
        'files'
      ],
      where: {
        owner: owner
      },
      order: {
        id: 'ASC'
      }
    })
    .catch(e => {
      throw new BadRequestException(e.message);
    });
  }
  /* */

  /* CREATE */
  async create(data: HouseBodyDto): Promise<HouseEntity> {

    data.guides = await this.guideService.getByForByIds(TFor.house, data.guides);
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
    await this.housePropertyEntity.save(data.property);

    return this.houseEntityRepository
      .save(data)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* */

  /* UPDATE */
  async mark(foundData: HouseEntity, markAsDelete: IHouse['markAsDelete']): Promise<HouseEntity> {
    const update = this.houseEntityRepository.merge(foundData, { markAsDelete });

    return this.houseEntityRepository
      .save(update)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async update(foundData: HouseEntity, updateData: HouseBodyDto): Promise<HouseEntity> {
    /* files */
    if (foundData.files){
      if (foundData.files.length > 0){
        for (const file of foundData.files){
          await this.fileService.deleteFile(file)
          // await this.minioClientService.delete(file['fileName'])
        }
      }
    }
    /* */

    /* property */
    if (updateData.property === null){
      await this.housePropertyEntity
        .remove(updateData.property['id'])
        .catch(e => {
          throw new BadRequestException(e.message);
        });
    }
    else if (updateData.property){
      if (Object.keys(updateData.property).length > 0){
        const foundProperty = this.housePropertyEntity.merge(foundData.property, updateData.property);
        updateData.property = await this.housePropertyEntity
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

    const result = this.houseEntityRepository.merge(foundData, updateData);

    result.files = updateData.files;
    result.guides = await this.guideService.getByForByIds(TFor.house, updateData.guides);
    result.status = await this.baseObjectService.transformFromIdToObject(updateData.status, this.statusEntityRepository, `status id = ${updateData.status} not found`);
    result.complex = await this.baseObjectService.transformFromIdToObject(updateData.complex, this.complexEntityRepository, `complex id = ${updateData.complex} not found`);
    result.country = await this.baseObjectService.transformFromIdToObject(updateData.country, this.countryEntityRepository, `country id = ${updateData.country} not found`);
    result.region = await this.baseObjectService.transformFromIdToObject(updateData.region, this.regionEntityRepository, `region id = ${updateData.region} not found`);
    result.city = await this.baseObjectService.transformFromIdToObject(updateData.city, this.cityEntityRepository, `city id = ${updateData.city} not found`);
    result.owner = foundData.owner

    return this.houseEntityRepository
      .save(result)
      .catch(e => {
        throw new BadRequestException(e.message);
      });

  }
  /* */

  /* DELETE */
  async delete(id: IHouse['id']): Promise<void> {
    const find = await this.findOne(id);

    if (!find) {
      throw new NotFoundException(`id = ${id} not found`);
    }

    this.houseEntityRepository
      .remove(find)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* */

}
