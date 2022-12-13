import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account.service';

@Injectable()
export class GlobalAccountGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly accountService: AccountService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const ctx = context.switchToHttp().getRequest();

    if (!ctx) {
      return true;
    }

    try {

      const token = ctx.headers.authorization.split(' ')[1];

      const data = this.jwtService.decode(token);

      const account = await this.accountService.findOne(data['id'], data['role']);

      ctx.account = account;

      return true;

    }
    catch (error) {}

    return true;
  }
}
