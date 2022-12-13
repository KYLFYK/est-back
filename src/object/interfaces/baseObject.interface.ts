import { IBaseInterface } from '../../common/interfaces/base.interface';
import { IAccount } from '../../account/interfaces/account.interface';
import { IStatus } from './status/status.interface';
import { IRegion } from 'src/region/interfaces/region.interface';
import { IGuide } from 'src/guide/interfaces/guide.interface';
import { IFile } from 'src/file/interfaces/IFile';
import { ILegalPurity } from 'src/leagal-purity/interfaces/ILegalPurity';
import { ICity } from 'src/city/interfaces/city.interface';
import { ICountry } from '../../country/interfaces/country.interface';
import { TObjectType } from '../types/TObjectType';

export interface IBaseObject extends IBaseInterface {
  objectType: TObjectType,
  name: string;
  description: string;
  address: string;
  postcode: string;
  longitude: number;
  latitude: number;
  price: number;
  views: number;
  country: ICountry;
  region: IRegion;
  city: ICity;
  owner: IAccount;
  status: IStatus;
  legalPurity: ILegalPurity;
  favorite: IAccount[];
  guides: IGuide[];
  markAsDelete: boolean;
  files: IFile[];
}
