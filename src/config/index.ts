import { AppConfig, APP_REG_TOKEN, IAppConfig } from './app.config';
import {
    DatabaseConfig,
    DB_REG_TOKEN,
    IDatabaseConfig,
} from './database.config';
import { IRedisConfig, REDIS_REG_TOKEN, RedisConfig } from './redis.config';
import {
    ISecurityConfig,
    SECURITY_REG_TOKEN,
    SecurityConfig,
} from './security.config';
import {
    ISwaggerConfig,
    SwaggerConfig,
    SWAGGER_REG_TOKEN,
} from './swagger.config';

export * from './app.config';
export * from './swagger.config';
export * from './database.config';
export * from './security.config';
export * from './redis.config';

export interface AllConfigType {
    [APP_REG_TOKEN]: IAppConfig;
    [SWAGGER_REG_TOKEN]: ISwaggerConfig;
    [DB_REG_TOKEN]: IDatabaseConfig;
    [SECURITY_REG_TOKEN]: ISecurityConfig;
    [REDIS_REG_TOKEN]: IRedisConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
    AppConfig,
    SwaggerConfig,
    DatabaseConfig,
    SecurityConfig,
    RedisConfig,
};
