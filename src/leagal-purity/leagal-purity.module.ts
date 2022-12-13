import { Module } from '@nestjs/common';
import { LeagalPurityController } from './leagal-purity.controller';
import { LeagalPurityService } from './leagal-purity.service';

@Module({
  controllers: [LeagalPurityController],
  providers: [LeagalPurityService],
})
export class LeagalPurityModule {}
