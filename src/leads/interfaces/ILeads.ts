import { TLeadStatus } from '../types/TLeadStatus';
import { IEarlyPayment } from './IEarlyPayment';

export interface ILeads {
  fio: string;
  phone: string;
  email: string;
  createAt: Date;
  objectId: number;
  statePrice: number;
  initialPayment: number;
  creditTerm: number;
  percentageRate: number;
  earlyPayment: IEarlyPayment[];
  monthlyPayment: number;
  creditTotal: number;
  percentTotal: number;
  monthlyIncome: number;
  status:  TLeadStatus;
}
