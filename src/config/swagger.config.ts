import { ConfigType, registerAs } from '@nestjs/config';
import { env } from '~/global/env';

export const swaggerRegToken = 'swagger';

export const SwaggerConfig = registerAs(swaggerRegToken, () => ({
    enable: env('SWAGGER_ENABLE'),
    path: env('SWAGGER_PATH'),
    version: env('SWAGGER_VERSION'),
}));

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>;
