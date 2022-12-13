import { IBaseIdInterface } from '../../../common/interfaces/base.interface';
import { IAgency } from '../agency/agency.interface';

export interface IAgent extends IBaseIdInterface {
  name: string;
  position: string;
  phone: object[];
  experience: Date;
  rating: number;
  inviteLink: string;
  messengers: object;
  agencyId: IAgency;
}
