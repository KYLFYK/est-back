import { define } from 'typeorm-seeding';
import { IStatus } from '../../../../src/object/interfaces/status/status.interface';
import { StatusEntity } from '../../../../src/object/entities/status.entity';

define(StatusEntity, () => {
  const entity = new StatusEntity();

  const data: Omit<IStatus, 'id'> = {
    status: 'На продаже',
  };

  return Object.assign(entity, data);
});
