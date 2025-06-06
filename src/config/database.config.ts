import { ConfigType, registerAs } from '@nestjs/config';
import dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env, envBoolean, envNumber } from '~/global/env';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const currentScript = process.env.npm_lifecycle_event;

const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: env('DB_HOST', '127.0.0.1'),
    port: envNumber('DB_PORT', 3306),
    username: env('DB_USERNAME'),
    password: env('DB_PASSWORD'),
    database: env('DB_DATABASE'),
    synchronize: envBoolean('DB_SYNCHRONIZE', false),
    multipleStatements: currentScript === 'typeorm',
    entities: ['dist/modules/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
};

export const DB_REG_TOKEN = 'database';

export const DatabaseConfig = registerAs(
    DB_REG_TOKEN,
    (): DataSourceOptions => dataSourceOptions
);

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>;

export const dataSource = new DataSource(dataSourceOptions);
