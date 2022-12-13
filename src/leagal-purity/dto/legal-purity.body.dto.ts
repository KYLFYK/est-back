import { ApiProperty } from "@nestjs/swagger";
import { ILegalPurity } from "../interfaces/ILegalPurity";

export class LegalPurityBodyDto implements Omit<ILegalPurity, 'id'> {
  @ApiProperty({ example: 'улица Шоссе Нефтяников, 22к2' })
  address: string;

  @ApiProperty({ example: 100 })
  areaValue: number;
  
  @ApiProperty({ example: 'м2' })
  areaUnits: string;

  @ApiProperty({ example: '94:06:0009005:3259' })
  cadastalNumber: string;

  @ApiProperty({ example: 19137895 })
  cadastralPrice: number;

  @ApiProperty({ example: 'Петров Петр Алексеевич' })
  currentOwnerName: string;

  @ApiProperty({ example: '2021-09-30' })
  currentOwnerStartDate: Date;
  
  @ApiProperty({ example: 1 })
  floor: number;

  @ApiProperty({ example: {
    "owners":["Иванов Петр Иванович"],
    "startDate": "2009-12-31",
    "finishDate":"2014-09-30"
  }})
  previewOwners: { owners: any[]; startDate: Date; finishDate: Date; };

  @ApiProperty({ example: [
    {"title": "На дом наложен арест", "status": true, "description": "На дом наложен арест (описание)"}, 
    {"title": "Записей об аренде не найдено", "status": false, "description": null}
  ] })
  encumbrances: { title: string; description: string; status: boolean; }[];

  @ApiProperty({ example: [
    {"title": "Дом в собственности менее 5 лет", "description": "При продаже продавец скорее всего должен будет заплатить налог с её продажи"}
  ] })
  recomendations: { title: string; description: string; }[];
}