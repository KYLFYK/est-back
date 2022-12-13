import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { ICustomer } from "../../interfaces/customer/customer.interface";
import { PhonesDto } from "../common/phones.dto";

export class CustomerPutBodyDto extends PhonesDto implements Omit<ICustomer, 'id'> {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string;
}