import { AdminEntity } from '../../account-property/entities/admin.entity';
import { CustomerEntity } from '../../account-property/entities/customer.entity';
import { DeveloperEntity } from '../../account-property/entities/developer.entity';
import { AgencyEntity } from '../../account-property/entities/agency.entity';
import { AgentEntity } from '../../account-property/entities/agent.entity';
import { LandEntity } from '../../object/entities/land.entity';
import { HouseEntity } from '../../object/entities/house.entity';
import { TownhouseEntity } from '../../object/entities/townhouse.entity';
import { ComplexEntity } from '../../object/entities/complex.entity';
import { IBaseInterface } from '../../common/interfaces/base.interface';

export interface IFile extends IBaseInterface{
  // toComplexObjectEntity?: ComplexEntity[];
  // toTownhouseObjectEntity?: TownhouseEntity[];
  // toHouseObjectEntity?: HouseEntity[];
  // toApartmentObjectEntity?: ;
  // toLandObjectEntity?: LandEntity[];
  // toAdminPropertyEntity?: AdminEntity[];
  // toCustomerPropertyEntity?: CustomerEntity[];
  // toDeveloperPropertyEntity?: DeveloperEntity[];
  // toAgencyPropertyEntity?: AgencyEntity[];
  // toAgentPropertyEntity?: AgentEntity[];
  fileName: string;
  url: string;
  mimeType: string;
  size: string;
}
