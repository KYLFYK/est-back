import { IBaseInterface } from '../../common/interfaces/base.interface';
import { IAccount } from '../../account/interfaces/account.interface';

export interface IAuth extends IBaseInterface {
  publicKey: string;
  privateKey: string;
  account: IAccount;
}
