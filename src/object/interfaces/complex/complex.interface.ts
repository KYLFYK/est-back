import { IBaseInterface } from '../../../common/interfaces/base.interface';
import { IAccount } from '../../../account/interfaces/account.interface';
import { IStatus } from '../status/status.interface';
import { IComplexProperty } from '../../../object-property/interfaces/complex/complexProperty.interface';
import { IGuide } from 'src/guide/interfaces/guide.interface';
import { IRegion } from 'src/region/interfaces/region.interface';
import { IConstructionProgress } from 'src/construction-progress/interfaces/construction-progress.interface';
import { IFile } from 'src/file/interfaces/IFile';
import { ICity } from 'src/city/interfaces/city.interface';
import { ICountry } from '../../../country/interfaces/country.interface';

export interface IComplex extends IBaseInterface {
  name: string;
  description: string;
  address: string;
  longitude: number;
  latitude: number;
  views: number;
  country: ICountry;
  region: IRegion;
  city: ICity;
  owner: IAccount;
  status: IStatus;
  markAsDelete: boolean;
  property: IComplexProperty;
  constructionProgress: IConstructionProgress[];
  guides: IGuide[];
  files: IFile[];
  readiness: IFile;
  favorite: IAccount[];
}
