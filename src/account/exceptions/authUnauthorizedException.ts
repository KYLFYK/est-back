import { UnauthorizedException } from '@nestjs/common';

export class AuthUnauthorizedException extends UnauthorizedException {
  constructor() {
    super({
      code: 'E_AUTH_02',
      message: 'Unauthorized',
    });
  }
}
