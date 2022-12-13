import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuideController } from './guide.controller';
import { GuideService } from './guide.service';

/* entities section */
import { GuideEntity } from './entities/guide.entity';
/* */

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GuideEntity,
    ]),
  ],
  controllers: [GuideController],
  providers: [GuideService],
})
export class GuideModule {}
