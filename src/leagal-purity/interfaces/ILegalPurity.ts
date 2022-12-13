import { GuideEntity } from '../../guide/entities/guide.entity';

export interface ILegalPurity {
  id: number;
  address: string;
  areaValue: number;
  areaUnits: string;
  floor: number;
  cadastralPrice: number;
  cadastalNumber: string;
  currentOwnerName: string;
  currentOwnerStartDate: Date;

  previewOwners: {
    owners: any[],
    startDate: Date,
    finishDate: Date,
  };

  encumbrances: {
    title: string,
    description: string,
    status: boolean,
  }[];

  recomendations: {
    title: string,
    description: string,
  }[];
}
