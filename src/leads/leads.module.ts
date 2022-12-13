import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsEntity } from './entities/leads.entity';
import { EarlyPaymentEntity } from './entities/early.payment.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
        EarlyPaymentEntity,
        LeadsEntity,
      ])
  ],
  controllers: [LeadsController],
  providers: [LeadsService]
})
export class LeadsModule {}
