import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { LegalPurityEntity } from './entities/legalPurity.entity';

@Injectable()
export class LeagalPurityService {

  validateData(legalPurityString: string): LegalPurityEntity{
    if (legalPurityString.length === 0 || !legalPurityString){
      return null
    }

    let legalPurityJSON: LegalPurityEntity;
    try{
      legalPurityJSON = plainToClass(LegalPurityEntity, JSON.parse(String(legalPurityString)))
    }
    catch(e){
      throw new BadRequestException('Legal purity must be json')
    }

    return legalPurityJSON;    

  }

}
