import * as dotenv from 'dotenv';

dotenv.config({ path: '.dev.env' });

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity.ts'],
  subscribers: ['src/**/*.subscriber.ts'],
  synchronize: true,
  seeds: [
    'test/local/seeders/*.ts',
    'test/local/seeders/*/*.ts',
  ],
  factories: [
    'test/local/factories/*.ts',
    'test/local/factories/*/*.ts',
    'test/common/factories/*.ts',
    'test/common/factories/*/*.ts',
  ],
};
