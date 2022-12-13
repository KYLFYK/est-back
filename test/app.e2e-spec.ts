import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

describe('Marketplace (e2e)', () => {

  const app = 'http://localhost:8008/api/'
  
  const tokens = {
    admin: null,
    agency: null
  }

  describe('Авторизация', () => {
    it('Администратор', () => {
      return request(app)
        .post('auth/login')
        .set('Accept', 'application/json')
        .send({
          publicKey: 'testadm123@mail.ru',
          privateKey: '123',
        })
        .expect(({ body }) => {
          expect(body.access).toBeDefined();
          expect(body.refresh).toBeDefined();
          tokens.admin = body.access;
        })
        .expect(HttpStatus.CREATED);
    });
    it('Агенство', () => {
      return request(app)
        .post('auth/login')
        .set('Accept', 'application/json')
        .send({
          publicKey: 'testagentstvo123@mail.ru',
          privateKey: '123',
        })
        .expect(({ body }) => {
          expect(body.access).toBeDefined();
          expect(body.refresh).toBeDefined();
          tokens.agency = body.access;
        })
        .expect(HttpStatus.CREATED);
    });
  })

  describe('Личные кабинеты', () => {
    describe('Редактирование', () => {
      it('Агенство', () => {
        return request(app)
          .put('agency/{accountId}?accountId=22')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${tokens.agency}`)
          .send({
            "phone": [
              {
                "ord": 1,
                "value": "+7(999)999-99-99"
              }
            ],
            "name": "stringName",
            "address": "string",
            "site": "string",
            "description": "string"
          })
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body.id).toBeDefined();
            expect(body.name).toEqual('stringName');
            expect(body.status).toBeDefined();
            expect(body.phone).toEqual([{
              "ord": 1,
              "value": "+7(999)999-99-99"
            }]);
            expect(body.address).toEqual('string');
            expect(body.site).toEqual('string');
            expect(body.description).toEqual('string');
          })
          
      })
    })
  })

});
