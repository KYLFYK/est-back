import { IGuide } from "src/guide/interfaces/guide.interface";
import * as faker from 'faker';

export function generate_guides_for_object(availableGuides: Array<IGuide>): Array<IGuide> {
    let result = [];
    let currentResult = [];
    
    const fewGuides = [
      {type: 'parking', countFrom: 1, countTo: 2},
      {type: 'window', countFrom: 1, countTo: 2},
      {type: 'buildings', countFrom: 1, countTo: 2},
      {type: 'safety', countFrom: 1, countTo: 2},
      {type: 'furniture', countFrom: 0, countTo: 6},
    ]
    
    for (let i of [...new Set(availableGuides.map(item => item.type_en))]){
      
      let specific = fewGuides.filter(function(obj){
        return obj.type === i
      });

      if (specific.length > 0){
        currentResult = generate_type(i, availableGuides, specific[0].countFrom, specific[0].countTo)  
      }
      else{
        currentResult = generate_type(i, availableGuides, 1, 1)
      }
      
      if (currentResult && currentResult.length > 0){
        result = result.concat(currentResult);
      }

    }

    return result;
}

function generate_type(type: string, arr: Array<IGuide>, countFrom: number = 0, countTo: number = 1): IGuide[] {

    let find = arr.filter(function(obj) {
      return obj.type_en === type;
    });

    const result = []
      for (let i = 1; i <= countTo; i++){
        if (find.length > 0){

          if (i <= countFrom || faker.random.boolean()){
            let el = faker.random.arrayElement(find);
            result.push(el)
            find = find.filter(function(obj){
              return obj.id !== el.id;
            })
          }

        }
      }
      return result
  }