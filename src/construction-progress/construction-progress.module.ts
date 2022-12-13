import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplexEntity } from '../object/entities/complex.entity';
import { ConstructionProgressController } from './construction-progress.controller';
import { ConstructionProgressService } from './construction-progress.service';
import { ConstructionProgressEntity } from './entities/construction-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConstructionProgressEntity,
      ComplexEntity,
    ])
  ],
  controllers: [ConstructionProgressController],
  providers: [ConstructionProgressService]
})
export class ConstructionProgressModule {}
