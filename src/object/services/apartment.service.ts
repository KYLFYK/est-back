import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { IApartment } from '../interfaces/apartment/apartment.interface';
import { ApartmentEntity } from '../entities/apartment.entity';
import { ComplexEntity } from '../entities/complex.entity';
import { StatusEntity } from '../entities/status.entity';
import { AccountEntity } from '../../account/entities/account.entity';
import { BaseObjectService } from './baseObject.service';
import { ApartmentBodyDto } from '../dto/apartment/apartment.body.dto';
import { GuideService } from '../../guide/guide.service';
import { TFor } from '../../guide/types/for';
import { IComplex } from '../interfaces/complex/complex.interface';
import * as nestedProperty from 'nested-property';
import { AgentEntity } from '../../account-property/entities/agent.entity';
import { DeveloperEntity } from '../../account-property/entities/developer.entity';
import { CustomerEntity } from '../../account-property/entities/customer.entity';
import { plainToClass } from 'class-transformer';
import { FileService } from '../../file/file.service';
import { ApartmentPropertyService } from '../../object-property/services/apartment-property.service';
import { LeagalPurityService } from '../../leagal-purity/leagal-purity.service';
import { LegalPurityEntity } from '../../leagal-purity/entities/legalPurity.entity';
import { ApartmentPropertyEntity } from '../../object-property/entities/apartmentProperty.entity';
import { RegionEntity } from '../../region/entities/region.entity';
import { CountryEntity } from '../../country/entities/country.entity';
import { CityEntity } from '../../city/entities/city.entity';
import { MinioClientService } from '../../minio-client/minio.client.service';

@Injectable()
export class ApartmentService {
  constructor(
    private readonly minioClientService: MinioClientService,

    @InjectRepository(ApartmentEntity)
    private apartmentEntityRepository: Repository<ApartmentEntity>,

    @InjectRepository(ComplexEntity)
    private complexEntityRepository: Repository<ComplexEntity>,

    @InjectRepository(StatusEntity)
    private statusEntityRepository: Repository<StatusEntity>,

    @InjectRepository(AgentEntity)
    private agentEntityRepository: Repository<AgentEntity>,

    @InjectRepository(DeveloperEntity)
    private developerEntityRepository: Repository<DeveloperEntity>,

    @InjectRepository(CustomerEntity)
    private customerEntityRepository: Repository<CustomerEntity>,

    @InjectRepository(LegalPurityEntity)
    private legalPurityEntityRepository: Repository<LegalPurityEntity>,

    @InjectRepository(ApartmentPropertyEntity)
    private apartmentPropertyEntityRepository: Repository<ApartmentPropertyEntity>,

    @InjectRepository(RegionEntity)
    private regionEntityRepository: Repository<RegionEntity>,

    @InjectRepository(CountryEntity)
    private countryEntityRepository: Repository<CountryEntity>,

    @InjectRepository(CityEntity)
    private cityEntityRepository: Repository<CityEntity>,

  ) { }

  @Inject()
  private baseObjectService: BaseObjectService;

  @Inject()
  private guideService: GuideService;

  @Inject()
  private readonly fileService: FileService;

  @Inject()
  private readonly apartmentPropertyService: ApartmentPropertyService;

  @Inject()
  private readonly leagalPurityService: LeagalPurityService;

  /* READ */
  async findAll(take: number = 10, skip: number = 0): Promise<ApartmentEntity[]> {
    return this.apartmentEntityRepository
      .createQueryBuilder('apartment')
      .where(`apartment.id in (Select apartment.id from apartment order by apartment.id limit ${take} offset ${skip})`)
      .leftJoinAndSelect('apartment.status', 'status')
      .leftJoinAndSelect('apartment.owner', 'account')
      .leftJoinAndSelect('apartment.guides', 'guide')
      .leftJoinAndSelect('apartment.region', 'region')
      .leftJoinAndSelect('apartment.country', 'country')
      .leftJoinAndSelect('apartment.files', 'files')
      .leftJoinAndSelect('apartment.complex', 'complex')
      .orderBy('apartment.id')
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async findOne(id: IApartment['id']): Promise<ApartmentEntity> {
    const result = await this.apartmentEntityRepository.findOne(id, {
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
        'favorite',
        'complex'
      ],
      order: {
        id: 'ASC'
      }
    })
    .catch(e => {
      throw new BadRequestException(e.message);
    });

    if (!result){
      return result
    }

    if (nestedProperty.get(result, 'owner.agentProperty')) {
      result.owner.agentProperty = await this.agentEntityRepository.findOne(result.owner.agentProperty, {
        relations: ['agencyId']
      })
    }
    else if (nestedProperty.get(result, 'owner.customerProperty')) {
      result.owner.customerProperty = await this.customerEntityRepository.findOne(result.owner.customerProperty)
    }

    if (nestedProperty.get(result, 'complex')) {
      result.complex = await this.complexEntityRepository.findOne(result.complex.id, {
        relations: ['owner']
      })

      if (nestedProperty.get(result.complex, 'owner.developerProperty')) {
        result.complex.owner.developerProperty = await this.developerEntityRepository.findOne(result.complex['developerProperty'])
      }
    }
    return result
  }

  async findByComplex(id: IApartment['complex'] | IComplex['id']): Promise<ApartmentEntity[]> {
    return this.apartmentEntityRepository
      .createQueryBuilder('apartment')
      .leftJoinAndSelect('apartment.status', 'status')
      .leftJoinAndSelect('apartment.property', 'property')
      .leftJoinAndSelect('apartment.owner', 'account')
      .leftJoinAndSelect('apartment.guides', 'guide')
      .leftJoinAndSelect('apartment.region', 'region')
      .leftJoinAndSelect('apartment.country', 'country')
      .leftJoinAndSelect('apartment.files', 'files')
      .where(`apartment.complex = ${id}`)
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  /* CREATE */
  async create(data: ApartmentBodyDto): Promise<ApartmentEntity> {
    data.guides = await this.guideService.getByForByIds(TFor.apartment, data.guides);
    // data.status = await this.baseObjectService.transformFromIdToObject(data.status, this.statusEntityRepository, `status id = ${data.status} not found`);
    // data.owner = await this.baseObjectService.transformFromIdToObject(data.owner, this.accountEntityRepository, `owner id = ${data.owner} not found`);
    // data.complex = await this.baseObjectService.transformFromIdToObject(data.complex, this.complexEntityRepository, `complex id = ${data.complex} not found`);
    // data.property = this.apartmentPropertyService.validateData(String(JSON.stringify(data.property)));
    // data.legalPurity = this.leagalPurityService.validateData(data.legalPurity);
    // data.files = [];

    if (Object.keys(data.legalPurity).length === 0) {
      throw new BadRequestException('Нет юридической чистоты')
    }

    if (Object.keys(data.property).length === 0) {
      throw new BadRequestException('Нет свойств объекта')
    }

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
    await this.apartmentPropertyEntityRepository.save(data.property);

    console.log(data)

    return this.apartmentEntityRepository.save(data);
  }
  /* */

  /* UPDATE */
  async mark(foundData: ApartmentEntity, markAsDelete: IApartment['markAsDelete']): Promise<ApartmentEntity> {
    const update = this.apartmentEntityRepository.merge(foundData, { markAsDelete });

    return this.apartmentEntityRepository
      .save(update)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async update(foundData: ApartmentEntity, updateData: ApartmentBodyDto): Promise<ApartmentEntity> {
    // console.log(updateData)
    /* files */
    if (foundData.files){
      if (foundData.files.length > 0){
        for (const file of foundData.files){
          await this.fileService.deleteFile(file)
          // await this.minioClientService.delete(file['fileName'])
        }
      }
    }

    /* property */
    if (updateData.property === null){
      await this.apartmentPropertyEntityRepository
        .remove(updateData.property['id'])
        .catch(e => {
          throw new BadRequestException(e.message);
        });
    }
    else if (updateData.property){
      if (Object.keys(updateData.property).length > 0){
        const foundProperty = this.apartmentPropertyEntityRepository.merge(foundData.property, updateData.property);
        updateData.property = await this.apartmentPropertyEntityRepository
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

    const result = this.apartmentEntityRepository.merge(foundData, updateData);

    result.files = updateData.files;

    result.guides = await this.guideService.getByForByIds(TFor.apartment, updateData.guides);
    result.status = await this.baseObjectService.transformFromIdToObject(updateData.status, this.statusEntityRepository, `status id = ${updateData.status} not found`);
    result.complex = await this.baseObjectService.transformFromIdToObject(updateData.complex, this.complexEntityRepository, `complex id = ${updateData.complex} not found`);
    result.country = await this.baseObjectService.transformFromIdToObject(updateData.country, this.countryEntityRepository, `country id = ${updateData.country} not found`);
    result.region = await this.baseObjectService.transformFromIdToObject(updateData.region, this.regionEntityRepository, `region id = ${updateData.region} not found`);
    result.city = await this.baseObjectService.transformFromIdToObject(updateData.city, this.cityEntityRepository, `city id = ${updateData.city} not found`);
    result.owner = foundData.owner

    return this.apartmentEntityRepository
      .save(result)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* */

}
