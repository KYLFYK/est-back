import * as nestedProperty from 'nested-property';

export class Mapper {

  static convert(_objectType: string, _data: any): {} {
    let convertedData: {};

    // lang
    const lang = _data.guides.filter(item => item.type === "lang")[0];

    //objectType
    const objectType = _data.guides.filter(item => item.type_en === "objectType")[0];

    //buildingType
    const buildingType = _data.guides.filter(item => item.type_en === "buildingType")[0];


    //favorite
    let favorite: boolean = false;
    if (_data.currentAccount){
      if (_data.favorite.filter( item => item.id === _data.currentAccount.id).length > 0){
        favorite = true
      }
    }

    switch (_objectType) {
      case "apartment":
      /*
        if (nestedProperty.get(_data, 'property.constructionFeatures')) {
          const constructionFeatures = {
            subtitle: 'Особенности стоительства',
            specificationsItems: []
          }
          for (const i of _data.property.constructionFeatures) {
            constructionFeatures.specificationsItems.push({
              value: i.value,
              label: {
                title: i.title,
                text: '',
              }
            })
          }
          objectSpecs.push(constructionFeatures)
        }
        */

        convertedData = {
          images: _data.files.map(function (i) {
            return {
              "id": i.id,
              "url": i.url,
              "mimeType": i.mimeType,
              "fileName": i.fileName,
              "size": i.size,
            }
          }),
          object_id: _data.id,
          lang: lang ? lang.value : null,
          name: _data.name,
          type: _objectType ? _objectType : null,
          orderType: _data.objectType,
          category: _data.status.status,
          address: _data.address,
          postcode: _data.postcode,
          city: _data.city ? _data.city.name : null,
          cityId: _data.city ? _data.city.id : null,
          country: _data.country ? _data.country.name : null,
          countryId: _data.country ? _data.country.id : null,
          lat: _data.latitude,
          lng: _data.longitude,
          price: _data.price,
          description: _data.description,
          sort: null,
          planning: "1",
          secondary_type: buildingType ? buildingType.value : null,
          favorite: favorite,
          publish: _data.createAt,
          views: _data.views,
          complex: _data.complex,
          info_options: {
            total_area: _data.property.area,
            living_area: _data.property.livingArea,
            bathroom_area: _data.property.bathroomArea,
            kitchen_area: _data.property.kitchenArea,
            rooms_area: _data.property.roomsArea,
            amount_bedrooms: _data.property.amountBedrooms,
            amount_showers: _data.property.amountShowers,
            amount_bathrooms: _data.property.amountBathrooms,
            floor: _data.property.floor,
            total_floors: _data.property.totalFloor,
            height_сeilings: _data.property.heightCeilings,
            total_rooms: _data.property.rooms,
            interior: _data.property.interior,
            complex: nestedProperty.get(_data, 'complex.name') ? _data.complex.name : null,
            deadline: _data.property.deadline,
            construction_features: _data.property.constructionFeatures,
          },
          description_items: _data.property.infrastructure,
          online_tour: {
            threeD_tour: {
              url: _data.property.threeD
            },
            vr_tour: {
              url: _data.property.vr
            }
          },
          object_specs: _data.guides.filter(item => item.subtitle_ru !== null),
          legalPurityData: _data.legalPurity ? Object.assign(_data.legalPurity, {risks: false}) : undefined,
          object_developer_info: nestedProperty.get(_data, 'complex.owner') ? _data.complex.owner : undefined,
          agency: nestedProperty.get(_data, 'owner.agentProperty.agencyId.name') ? _data.owner.agentProperty.agencyId.name : undefined,
          customer: nestedProperty.get(_data, 'owner.customerProperty') ? _data.owner.customerProperty : undefined,
          construction_progress: _data.constructionProgress,
        }
        break;

      case "house":
        /*
        if (nestedProperty.get(_data, 'property.constructionFeatures')) {
          const constructionFeatures = {
            subtitle: 'Особенности стоительства',
            specificationsItems: []
          }
          for (const i of _data.property.constructionFeatures) {
            constructionFeatures.specificationsItems.push({
              value: i.value,
              label: {
                title: i.title,
                text: '',
              }
            })
          }
          objectSpecs.push(constructionFeatures)
        }
        */
        convertedData = {
          images: _data.files.map(function (i) {
            return {
              "id": i.id,
              "url": i.url,
              "mimeType": i.mimeType,
              "fileName": i.fileName,
              "size": i.size,
            }
          }),
          object_id: _data.id,
          lang: lang ? lang.value : null,
          name: _data.name,
          type: _objectType ? _objectType : null,
          orderType: _data.objectType,
          category: _data.status.status,
          address: _data.address,
          postcode: _data.postcode,
          city: _data.city ? _data.city.name : null,
          cityId: _data.city ? _data.city.id : null,
          country: _data.country ? _data.country.name : null,
          countryId: _data.country ? _data.country.id : null,
          lat: _data.latitude,
          lng: _data.longitude,
          price: _data.price,
          description: _data.description,
          sort: null,
          planning: "1",
          secondary_type: buildingType ? buildingType.value : null,
          favorite: favorite,
          publish: _data.createAt,
          views: _data.views,
          agency: nestedProperty.get(_data, 'owner.agentProperty.agencyId.name') ? _data.owner.agentProperty.agencyId.name : null,
          info_options:
            _data.property ?
            {
              total_floor: _data.property.totalFloor,
              total_area: _data.property.totalArea,
              area: _data.property.area,
              land_area: _data.property.landArea,
              living_area: _data.property.livingArea,
              bathroom_area: _data.property.bathroomArea,
              kitchen_area: _data.property.kitchenArea,
              total_rooms: _data.property.rooms,
              floors: _data.property.floors,
              construction_features: _data.property.constructionFeatures,
            } : null,
          description_items: _data.property ? _data.property.infrastructure : null,
          online_tour: {
            threeD_tour: {
              url: _data.property ? _data.property.threeD : null
            },
            vr_tour: {
              url: _data.property ? _data.property.vr : null
            }
          },
          object_specs: _data.guides.filter(item => item.subtitle_ru !== null),
          legalPurityData: _data.legalPurity ? Object.assign(_data.legalPurity, {risks: false}) : undefined,
          owner: _data.owner,
        }
        break;

      case "land":
        convertedData = {
          images: _data.files.map(function (i) {
            return {
              "id": i.id,
              "url": i.url,
              "mimeType": i.mimeType,
              "fileName": i.fileName,
              "size": i.size,
            }
          }),
          object_id: _data.id,
          lang: lang ? lang.value : null,
          name: _data.name,
          type: _objectType ? _objectType : null,
          orderType: _data.objectType,
          category: _data.status.status,
          address: _data.address,
          postcode: _data.postcode,
          city: _data.city ? _data.city.name : null,
          cityId: _data.city ? _data.city.id : null,
          country: _data.country ? _data.country.name : null,
          countryId: _data.country ? _data.country.id : null,
          lat: _data.latitude,
          lng: _data.longitude,
          price: _data.price,
          description: _data.description,
          sort: null,
          planning: "2",
          favorite: favorite,
          publish: _data.createAt,
          views: _data.views,
          agency: nestedProperty.get(_data, 'owner.agentProperty.agencyId.name') ? _data.owner.agentProperty.agencyId.name : null,
          info_options: [
            {
              "label": "Общая площадь",
              "value": `${_data.property.area} соток`
            },
            {
              "label": "Статус участка",
              "value": nestedProperty.get(_data, 'status.status') ? _data.status.status : null
            },
          ],
          description_items: _data.description,
          description_Info: _data.property.infrastructure,
          object_specs: _data.guides.filter(item => item.subtitle_ru !== null),
          legalPurityData: _data.legalPurity ? Object.assign(_data.legalPurity, {risks: false}) : undefined,
        }
        break;

      case "complex":
        convertedData = {
          images: _data.files.map(function (i) {
            return {
              "id": i.id,
              "url": i.url,
              "mimeType": i.mimeType,
              "fileName": i.fileName,
              "size": i.size,
            }
          }),
          object_id: _data.id,
          lang: lang ? lang.value : null,
          name: _data.name,
          type: _objectType ? _objectType : null,
          orderType: _data.objectType,
          category: _data.status.status,
          address: _data.address,
          postcode: _data.postcode,
          city: _data.city ? _data.city.name : null,
          cityId: _data.city ? _data.city.id : null,
          country: _data.country ? _data.country.name : null,
          countryId: _data.country ? _data.country.id : null,
          lat: _data.latitude,
          lng: _data.longitude,
          description: _data.description,
          sort: null,
          planning: "2",
          total_floors: _data.property.amountFloors,
          favorite: favorite,
          publish: _data.createAt,
          views: _data.views,
          info_options: [_data.property],
          object_specs: _data.guides.filter(item => item.subtitle_ru !== null),
          object_developer_info: _data.owner,
          schedule: _data.constructionProgress,
          planningList: _data.planningList
        };
        break;

      default:
        convertedData = {};
        break;
    }
    return convertedData;
  }
}

function parseGuide(arr: any[]): any[] {

  let result = arr.filter(item => item.subtitle_ru !== null)

  result = result.map(function (i) {
    return {
      subtitle: i.subtitle_ru,
      specificationsItems: []
    }
  })

  result = [...new Map(result.map(item => [item['subtitle'], item])).values()]

  for (const i of arr) {

    let indexSubtitle = result.findIndex(function (obj) {
      return obj.subtitle === i.subtitle_ru;
    })

    if (indexSubtitle >= 0) {
      result[indexSubtitle]['specificationsItems'].push({
        value: i.type_en,
        label: {
          title: i.type_ru,
          text: i.value
        }
      })
    }

  }
  return result
}
