import { IPress } from 'src/press/interfaces/press.interface';
import { IBaseIdInterface } from '../../../common/interfaces/base.interface';

export interface IDeveloper extends IBaseIdInterface {
  press: IPress[];
  name: string;
  type: string;
  logo: string;
  completedComplexAmount: number;
  completedBuildingAmount: number;
  inProgressComplexAmount: number;
  inProgressBuildingAmount: number;
  phone: Array<object>;
  address: string;
  site: string;
  description: string;
  //experience: number;

  legalFullName: string;
  legalAddress: string;
  authorizedCapital: number;
  OKFS: string;
  OKOPF: string;
  OKOGU: string;
  INN: string;
  OGRN: string;
  KPP: string;
  OKATO: string;
  OKPO: string;
  OKTMO: string;
  status: string;
  leaderName: string;

  founders: string;
  enterpriseSize: number;
  numberOfStaff: number;
  branch: number;
  revenue: number;
  netProfit: number;
  netAssets: number;
  registrationDate: Date;
  registrationAuthorityName: string;
  registrationAuthorityAddress: string;
  registeringAuthorityLocated: string;
  mainOccupation: string;
  
  extraOccupations: Array<object>;
  statistics: Array<object>;
  risks: Array<object>;
}
