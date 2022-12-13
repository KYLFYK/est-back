import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsSubscriptionEntity } from './entities/news-subscription.entity';
import { NewsSubscriptionController } from './news-subscription.controller';
import { NewsSubscriptionService } from './news-subscription.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      NewsSubscriptionEntity,
    ])
  ],  
  controllers: [NewsSubscriptionController],
  providers: [NewsSubscriptionService]
})
export class NewsSubscriptionModule {}
