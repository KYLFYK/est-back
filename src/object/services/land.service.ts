import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILand } from '../interfaces/land/land.interface';
import { LandEntity } from '../entities/land.entity';
import { StatusEntity } from '../entities/status.entity';
import { AccountEntity } from '../../account/entities/account.entity';
import { GuideEntity } from '../../guide/entities/guide.entity';
import { BaseObjectService } from './baseObject.service';
import { LandBodyDto } from '../dto/land/land.body.dto';
import { GuideService } from '../../guide/guide.service';
import { TFor } from '../../guide/types/for';
import { AccountService } from '../../account/account.service';
import * as nestedProperty from 'nested-property';
import { AgentEntity } from '../../account-property/entities/agent.entity';
import { LegalPurityEntity } from '../../leagal-purity/entities/legalPurity.entity';
import { LandPropertyEntity } from '../../object-property/entities/landProperty.entity';
import { FileService } from '../../file/file.service';
import { CityEntity } from '../../city/entities/city.entity';
import { CountryEntity } from '../../country/entities/country.entity';
import { RegionEntity } from '../../region/entities/region.entity';
import { MinioClientService } from '../../minio-client/minio.client.service';

@Injectable()
export class LandService {

  constructor(
    private readonly minioClientService: MinioClientService,

    @InjectRepository(LandEntity)
    private landEntityRepository: Repository<LandEntity>,

    @InjectRepository(LandPropertyEntity)
    private landPropertyEntityRepository: Repository<LandPropertyEntity>,

    @InjectRepository(StatusEntity)
    private statusEntityRepository: Repository<StatusEntity>,

    @InjectRepository(AccountEntity)
    private accountEntityRepository: Repository<AccountEntity>,

    @InjectRepository(AgentEntity)
    private agentEntityRepository: Repository<AgentEntity>,

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
  async findAll(take: number = 10, skip: number = 0): Promise<LandEntity[]> {
    return this.landEntityRepository
      .createQueryBuilder('land')
      .where(`land.id in (Select land.id from land limit ${take} offset ${skip})`)
      .leftJoinAndSelect('land.status', 'status')
      .leftJoinAndSelect('land.owner', 'account')
      .leftJoinAndSelect('land.guides', 'guide')
      .leftJoinAndSelect('land.region', 'region')
      .leftJoinAndSelect('land.country', 'country')
      .leftJoinAndSelect('land.files', 'files')
      .orderBy('land.id')
      .getMany()
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async findOne(id: ILand['id']): Promise<LandEntity> {
    const result = await this.landEntityRepository.findOne(id, {
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

    return result
  }
  /* */

  /* CREATE */
  async create(data: LandBodyDto): Promise<LandEntity> {

    data.guides = await this.guideService.getByForByIds(TFor.land, data.guides);
    data.status = await this.baseObjectService.transformFromIdToObject(data.status, this.statusEntityRepository, `status id = ${data.status} not found`);
    data.owner = await this.baseObjectService.transformFromIdToObject(data.owner, this.accountEntityRepository, `owner id = ${data.owner} not found`);

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

    await this.legalPurityEntityRepository.save(data.legalPurity)
    await this.landPropertyEntityRepository.save(data.property);

    return this.landEntityRepository
      .save(data)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* */

  /* UPDATE */
  async mark(foundData: LandEntity, markAsDelete: ILand['markAsDelete']): Promise<LandEntity> {
    const update = this.landEntityRepository.merge(foundData, { markAsDelete });

    return this.landEntityRepository
      .save(update)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }

  async update(foundData: LandEntity, updateData: LandBodyDto): Promise<LandEntity> {

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
      await this.landPropertyEntityRepository
        .remove(updateData.property['id'])
        .catch(e => {
          throw new BadRequestException(e.message);
        });
    }
    else if (updateData.property){
      if (Object.keys(updateData.property).length > 0){
        const foundProperty = this.landPropertyEntityRepository.merge(foundData.property, updateData.property);
        updateData.property = await this.landPropertyEntityRepository
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

    const result = this.landEntityRepository.merge(foundData, updateData);

    result.files = updateData.files;
    result.guides = await this.guideService.getByForByIds(TFor.land, updateData.guides);
    result.status = await this.baseObjectService.transformFromIdToObject(updateData.status, this.statusEntityRepository, `status id = ${updateData.status} not found`);
    result.owner = await this.baseObjectService.transformFromIdToObject(updateData.owner, this.accountEntityRepository, `owner id = ${updateData.owner} not found`);
    result.country = await this.baseObjectService.transformFromIdToObject(updateData.country, this.countryEntityRepository, `country id = ${updateData.country} not found`);
    result.region = await this.baseObjectService.transformFromIdToObject(updateData.region, this.regionEntityRepository, `region id = ${updateData.region} not found`);
    result.city = await this.baseObjectService.transformFromIdToObject(updateData.city, this.cityEntityRepository, `city id = ${updateData.city} not found`);
    result.owner = foundData.owner

    return this.landEntityRepository
      .save(result)
      .catch(e => {
        throw new BadRequestException(e.message);
      });

  }
  /* */

  /* DELETE */
  async delete(id: ILand['id']): Promise<void> {

    const find = await this.findOne(id);

    if (!find) {
      throw new NotFoundException(`id = ${id} not found`);
    }

    this.landEntityRepository
      .remove(find)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
  /* */

}
