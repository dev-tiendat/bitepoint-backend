import { registerAs } from '@nestjs/config';

import { env, envArray } from '~/global/env';
import { GateConfig } from '~/modules/payment-system/gateway/gateway.interface';
import { ProxyConfig } from '~/modules/payment-system/proxy/proxy.interfaces';

export const PAYMENT_REG_TOKEN = 'payment';

export const PaymentConfig = registerAs(PAYMENT_REG_TOKEN, () => ({
    captchaApiKey: env('CAPTCHA_API_KEY'),
    vietQrApiKey: env('VIETQR_API_KEY'),
    vietQrClientId: env('VIETQR_CLIENT_ID'),
    gateways: envArray<GateConfig>('PAYMENT_GATEWAYS'),
    proxies: envArray<ProxyConfig>('PAYMENT_PROXIES'),
}));

export type IPaymentConfig = ReturnType<typeof PaymentConfig>;
