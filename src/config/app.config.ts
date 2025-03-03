import { ConfigType, registerAs } from '@nestjs/config';
import { env, envBoolean, envNumber } from '~/global/env';

export const APP_REG_TOKEN = 'app';

const globalPrefix = env('GLOBAL_PREFIX', 'api');

export const AppConfig = registerAs(APP_REG_TOKEN, () => ({
    name: env('APP_NAME'),
    port: envNumber('APP_PORT', 3000),
    baseUrl: env('APP_BASE_URL'),
    globalPrefix,
    locale: env('APP_LOCALE', 'vi_VI'),
    timeZone: env('APP_TIME_ZONE', 'Asia/Ho_Chi_Minh'),
    multiDeviceLogin: envBoolean('MULTI_DEVICE_LOGIN', true),
}));

export type IAppConfig = ConfigType<typeof AppConfig>;

export const RouterWhitelist: string[] = [
    `${globalPrefix ? '/' : ''}${globalPrefix}/v1/auth/login`,
    `${globalPrefix ? '/' : ''}${globalPrefix}/v1/auth/register`,
    `${globalPrefix ? '/' : ''}${globalPrefix}/v1/auth/refreshToken`,
];
