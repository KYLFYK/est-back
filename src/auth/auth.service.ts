import { createHash } from '../common/utils/util.createHash';
import { compare } from 'bcrypt';
import { Inject, Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { IAuth } from './interfaces/auth.interface';
import { IAccount } from '../account/interfaces/account.interface';
import { AuthEntity } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';
import { PropertyService } from '../account-property/property.service';
import { MailService } from '../mail/mail.service';
import { TRole } from '../account/types/role';
import { AccountEntity } from '../account/entities/account.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(AuthEntity)
    private authEntityRepository: Repository<AuthEntity>,
  ) {}

  @Inject()
  private readonly accountService: AccountService;

  @Inject()
  private readonly mailService: MailService;

  @Inject()
  private readonly propertyService: PropertyService;

  @Inject()
  private readonly jwtService: JwtService;

  async register(
    login: IAuth['publicKey'],
    password: IAuth['privateKey'],
    phone: IAccount['phone'],
    name: string,
    role: TRole
  ): Promise<{access: string; refresh: string}> {

    // start transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      
      /* create property record */
      const entity = this.propertyService.getRepositoryByRole(role)
      let property: any;
      if (entity){
        let phoneData: IAccount['phone'] | [{}];
        
        if (role === TRole.customer){
          phoneData = phone
        }
        else {
          phoneData = [{"ord": 1, "value": phone}]
        }
            
        property = await queryRunner.manager
          .save(plainToClass(entity, {
              name, 
              phone: phoneData
            }
          ))
          .catch(e => {
            throw new BadRequestException(e.message);
          });     
      }
      /* */

      /* create account record */
      const accountData = {
        email: login,
        phone: phone,
        markAsDelete: false,
        isConfirmed: false,
        role: role
      }
      if (property){
        accountData[`${role}Property`] = property
      }

      const account = await queryRunner.manager
        .save(plainToClass(AccountEntity, accountData))
        .catch(e => {
          throw new BadRequestException(e.message);
        });
      /* */

      /* create auth record */
      const data = {
        publicKey: login,
        privateKey: await createHash(password),
        account,
      };
      
      await queryRunner.manager
        .save(plainToClass(AuthEntity, data))
        .catch(e => {
          throw new BadRequestException(e.message);
        });
      /* */

      await queryRunner.commitTransaction();

      const token = await this.generateToken(account);
      /* send the confirmation to mail */
      const html = `<a href="https://estatum.f-case.ru/?text=email-conformation&token=${token.access}">Click here</a> for reset password`;
      this.mailService.sendMessage(account.email, 'Подтверждение email', null, html);
      /* */
      
      return { access: token.access, refresh: token.refresh };
    }

    catch(e){
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message)
    }
    finally {      
      await queryRunner.release();
    }
  }

  private async generateToken(
    data,
    accessDuration = process.env.ACCEESS_TOKEN_DURATION,
    refreshDuration = process.env.REFRESH_TOKEN_DURATION,
  ): Promise<{ access: string; refresh: string }> {

    const access = this.jwtService.sign(
      { email: data.publicKey, role: data.role, id: data.id },
      { expiresIn: accessDuration },
    );

    const refresh = this.jwtService.sign(
      { email: data.publicKey, role: data.role, id: data.id },
      { expiresIn: refreshDuration },
    );

    return { access, refresh };
  }

  async decode(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }

  async login(login: IAuth['publicKey'], password: IAuth['privateKey']): Promise<{ access: string; refresh: string }> {
    const auth = await this.authEntityRepository.findOne({
      where: {
        publicKey: login,
      },
    });

    if (!auth) {
      throw new NotFoundException('Auth not found');
    }

    const account = await this.accountService.findByEmail(login);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.markAsDelete) {
      throw new NotFoundException('Account is deleted');
    }

    const compareHash = await compare(password, auth.privateKey);

    if (!compareHash) {
      throw new BadRequestException('Wrong password or login');
    }

    const token = await this.generateToken({ publicKey: auth.publicKey, role: account.role, id: account.id });

    await this.propertyService.log(TRole[account.role]);

    return { access: token.access, refresh: token.refresh };
  }

  async refreshToken(token: string): Promise<{ access: string; refresh: string }> {
    let data: Record<string, unknown>;

    try {
      data = await this.jwtService.verify(token);
    }
    catch (e) {
      throw new BadRequestException('Token is not valid');
    }
    const newToken = await this.generateToken({ publicKey: data['email'], role: data['role'], id: data['id'] });

    return { access: newToken.access, refresh: newToken.refresh };
  }

  async checkToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify(token);
    }
    catch (e) {
      return false;
    }

    return true;
  }

  async reset(
    email: IAuth['publicKey'] | IAccount['email'],
    controller: string
  ): Promise<IAuth['publicKey'] | IAccount['email']> {
    const account = await this.accountService.findByEmail(email);

    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const token = await this.generateToken(
      { publicKey: account.email, role: account.role, id: account.id },
      '5m',
      '5m'
    );
    const html = `<a href="https://estatum.f-case.ru/?text=reset-password&token=${token.access}">Click here</a> for reset password`;
    this.mailService.sendMessage(account.email, 'Reset password', null, html);

    return account.email;
  }

  async changePassword(
    token: string,
    accountId: IAccount['id'],
    newPassword: IAuth['privateKey']
  ): Promise<void> {

    if (! await this.checkToken(token)) {
      throw new ForbiddenException('token is wrong');
    }
    const account = await this.accountService.findOne(accountId);

    const accountToken = await this.decode(token);

    if (account) {
      if (account.id !== accountToken.id) {
        throw new ForbiddenException('access denied');
      }
    }

    if (!account) {
      throw new NotFoundException(`accountId = ${accountId} doesn't exist`);
    }

    const foundData = await this.authEntityRepository.findOne({ account });
    const update = this.authEntityRepository.merge(foundData, { privateKey: await createHash(newPassword) });

    await this.authEntityRepository.save(update);
  }

}
