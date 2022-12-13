import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseIdDto } from '../common/dto/base.dto';
import { Repository } from 'typeorm';
import { NewsSubscriptionPostBodyDto } from './dto/news-subscription.post.dto';
import { NewsSubscriptionPutBodyDto } from './dto/news-subscription.put.dto';
import { NewsSubscriptionEntity } from './entities/news-subscription.entity';
import { INewsSubscription } from './interfaces/news-subscription.interface';

@Injectable()
export class NewsSubscriptionService {

    constructor(
        @InjectRepository(NewsSubscriptionEntity)
        private newsSubscriptionEntityRepository: Repository<NewsSubscriptionEntity>,
    ) { }

    /* READ */
    async findOne(id: INewsSubscription['id']): Promise<NewsSubscriptionEntity> {
      return this.newsSubscriptionEntityRepository.findOne(id)
    }
    /* */

    /* CREATE */
    async create(data: NewsSubscriptionPostBodyDto): Promise<BaseIdDto> {
      const compare = await this.newsSubscriptionEntityRepository.findOne({
        where: [
            { email: data.email },
            { phone: data.phone }
        ]
      })

      if (compare) {
        if (compare.email === data.email) {
          throw new BadRequestException(`Пользователь с email ${data.email} уже подписан на новости`)
        }
        if (compare.phone === data.phone) {
          throw new BadRequestException(`Пользователь с телефоном ${data.phone} уже подписан на новости`)
        }
      }

      const result = await this.newsSubscriptionEntityRepository
        .save(data)
        .catch(e => {
          throw new BadRequestException(e.message);
        });
      return { id: result.id };
    }
    /* */

    /* UPDATE
    async update(foundData: NewsSubscriptionEntity, updateData: NewsSubscriptionPutBodyDto): Promise<NewsSubscriptionEntity> {

        const update = this.newsSubscriptionEntityRepository.merge(foundData, updateData);

        return this.newsSubscriptionEntityRepository
            .save(update)
            .catch(e => {
                throw new BadRequestException(e.message);
            });
    }
    /* */

    /* DELETE */
    async delete(id: INewsSubscription['id']): Promise<void> {
      await this.newsSubscriptionEntityRepository
        .createQueryBuilder()
        .delete()
        .where({ id })
        .execute()
        .catch(e => {
          throw new BadRequestException(e.message);
        });
    }
    /* */
}
