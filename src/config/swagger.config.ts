import { ConfigType, registerAs } from '@nestjs/config';
import { env } from '~/global/env';

export const SWAGGER_REG_TOKEN = 'swagger';

export const SwaggerConfig = registerAs(SWAGGER_REG_TOKEN, () => ({
    enable: env('SWAGGER_ENABLE'),
    path: env('SWAGGER_PATH'),
    version: env('SWAGGER_VERSION'),
}));

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>;
