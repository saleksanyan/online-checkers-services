import { ConfigService, registerAs } from '@nestjs/config';
import { config as envConfig } from 'dotenv';
import { env } from 'node:process';
import { DataSource } from 'typeorm';

envConfig({ path: `.env.${env.NODE_ENV || 'local'}` });
const configService: ConfigService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  synchronize: true,
  logging: !!`.env.${env.NODE_ENV}`,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

const config = {
  type: 'postgres',
  host: env.DB_HOST,
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  synchronize: true,
  logging: !!`.env.${env.NODE_ENV}`,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
};

export const typeormConfig = registerAs('typeorm', () => config);
