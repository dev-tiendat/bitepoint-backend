import { AppConfig, appRegToken, IAppConfig } from './app.config';
import { DatabaseConfig, dbRegToken, IDatabaseConfig } from './database.config';
import {
    ISwaggerConfig,
    SwaggerConfig,
    swaggerRegToken,
} from './swagger.config';

export * from './app.config';
export * from './swagger.config';
export * from './database.config';

export interface AllConfigType {
    [appRegToken]: IAppConfig;
    [swaggerRegToken]: ISwaggerConfig;
    [dbRegToken]: IDatabaseConfig;
}

export default {
    AppConfig,
    SwaggerConfig,
    DatabaseConfig,
};
