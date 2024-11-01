import { ConfigType, registerAs } from '@nestjs/config';
import { env, envNumber } from '~/global/env';

export const appRegToken = 'app';

const globalPrefix = env('GLOBAL_PREFIX', 'api');

export const AppConfig = registerAs(appRegToken, () => ({
    name: env('APP_NAME'),
    port: envNumber('PORT', 3000),
    baseUrl: env('APP_BASE_URL'),
    globalPrefix,
    locale: env('APP_LOCALE', 'vi_VI'),
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
