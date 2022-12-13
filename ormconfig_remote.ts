import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.prod.env' });

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  ssl: {
    rejectUnauthorized: false,
    ca: path.resolve(__dirname, '../', 'keys', process.env.POSTGRES_KEY),
  },
  entities: ['src/**/*.entity.ts'],
  subscribers: ['src/**/*.subscriber.ts'],
  synchronize: false,
  seeds: [
    'test/remote/seeders/*.ts',
    'test/remote/seeders/*/*.ts',
  ],
  factories: [
    'test/remote/factories/*.ts',
    'test/remote/factories/*/*.ts',
    'test/common/factories/*.ts',
    'test/common/factories/*/*.ts',
  ],
};
