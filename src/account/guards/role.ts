import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles';
import { TRole } from '../types/role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private JwtService: JwtService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {

      const requiredRoles = this.reflector.getAllAndOverride<TRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;

      let [bearer, token] = ['', ''];

      if (authHeader) {
        [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
          throw new UnauthorizedException();
        }
      }
      else {
        [bearer, token] = req.headers.cookie.split('=');
      }

      const user = this.JwtService.verify(token);

      req.user = user;

      const result = requiredRoles.includes(user.role);

      if (!result) {
        throw 'ForbiddenException';
      }

      return result;
    }
    catch (e) {
      if (e === 'ForbiddenException') {

        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Forbidden',
          redirect: '/',
        });
        
      }

      throw new UnauthorizedException();
    }
  }
}
