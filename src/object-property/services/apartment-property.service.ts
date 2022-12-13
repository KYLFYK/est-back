import { BadRequestException, Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { ApartmentPropertyEntity } from "../entities/apartmentProperty.entity";
import { TConstructionFeatures } from "../types/construction-features";

@Injectable()
export class ApartmentPropertyService {

  validateData(propertyString: string): ApartmentPropertyEntity{
    if (propertyString.length === 0 || !propertyString){
      return null
    }

    let propertyJSON: ApartmentPropertyEntity;
    try{
      propertyJSON = plainToClass(ApartmentPropertyEntity, JSON.parse(String(propertyString)))
    }
    catch(e){
      throw new BadRequestException ('Property must be json')
    }

    /* constructionFeatures */
    if (propertyJSON.constructionFeatures){
      propertyJSON.constructionFeatures = propertyJSON.constructionFeatures.map(function (i) {
        return {
          title: i['title'],
          value: i['value'],
        }
      })
      for (let i = 0; i <= propertyJSON.constructionFeatures.length - 1; i++) { // выведет 0, затем 1, затем 2
        if (!propertyJSON.constructionFeatures[i]['title']){
          throw new BadRequestException (`title must be in constructionFeatures.${i}`)
        }
        if (!propertyJSON.constructionFeatures[i]['value']){
          throw new BadRequestException (`value must be in constructionFeatures.${i}`)
        }
        if (!TConstructionFeatures[propertyJSON.constructionFeatures[i]['value']]){
          throw new BadRequestException (`constructionFeatures.${i}.value must be one of ${Object.values(TConstructionFeatures)}`)
        }
      }
    }
    /* */
    return propertyJSON;    

  }
}