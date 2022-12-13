import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { AuthUnauthorizedException } from '../exceptions/authUnauthorizedException';

// eslint-disable  @typescript-eslint/naming-convention
export const CurrentAccount = createParamDecorator(

  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      //throw new AuthUnauthorizedException();
    }

    return request.account;
  },
);
