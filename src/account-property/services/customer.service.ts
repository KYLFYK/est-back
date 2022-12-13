import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IAccount } from "src/account/interfaces/account.interface";
import { Repository } from "typeorm";
import { CustomerPutBodyDto } from "../dto/customer/customer.put.dto";
import { CustomerEntity } from "../entities/customer.entity";
import { ICustomer } from "../interfaces/customer/customer.interface";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerEntityRepository: Repository<CustomerEntity>,
  ) {}

  async findOne(id: number | ICustomer['id'] | IAccount['customerProperty']): Promise<CustomerEntity> {
    return this.customerEntityRepository.findOne(Number(id));
  }

  async update(foundData: CustomerEntity, updateData: CustomerPutBodyDto): Promise<CustomerEntity>{
    const result = this.customerEntityRepository.merge(foundData, updateData);
    return this.customerEntityRepository
      .save(result)
      .catch(e => {
        throw new BadRequestException(e.message);
      });
  }
}