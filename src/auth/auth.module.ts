import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { PropertyService } from '../account-property/property.service';
import { MailService } from '../mail/mail.service';
import { AuthEntity } from './entities/auth.entity';
import { AccountEntity } from '../account/entities/account.entity';
import { AdminEntity } from '../account-property/entities/admin.entity';
import { DeveloperEntity } from '../account-property/entities/developer.entity';
import { DeveloperService } from '../account-property/services/developer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthEntity,
      AccountEntity,
      AdminEntity,
      DeveloperEntity,
    ]),

    JwtModule.register({
      secret: process.env.SECRET_KEY || 'TEST_SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccountService, PropertyService, DeveloperService, MailService],
})
export class AuthModule {}
