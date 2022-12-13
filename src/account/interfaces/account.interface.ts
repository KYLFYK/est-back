import { TRole } from '../types/role';
import { IBaseInterface } from '../../common/interfaces/base.interface';
import { ICustomer } from '../../account-property/interfaces/customer/customer.interface';
import { IDeveloper } from '../../account-property/interfaces/developer/developer.interface';
import { IAgency } from '../../account-property/interfaces/agency/agency.interface';
import { IAgent } from '../../account-property/interfaces/agent/agent.interface';
import { IAdmin } from '../../account-property/interfaces/admin/admin.interface';
import { IBank } from 'src/account-property/interfaces/bank/bank.interface';

export interface IAccount extends IBaseInterface {
  email: string;
  phone: string;
  role: TRole;
  markAsDelete: boolean;
  isConfirmed: boolean;
  customerProperty?: ICustomer;
  developerProperty?: IDeveloper;
  agencyProperty?: IAgency;
  agentProperty?: IAgent;
  adminProperty?: IAdmin;
  bankProperty?: IBank;
}
