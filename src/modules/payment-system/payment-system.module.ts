import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { CaptchaSolverModule } from './captcha-solver/captcha-solver.module';
import { ProxyModule } from './proxy/proxy.module';
import { GatewayModule } from './gateway/gateway.module';
import { PaymentModule } from './payment/payment.module';

const modules = [
    CaptchaSolverModule,
    ProxyModule,
    GatewayModule,
    PaymentModule,
];

@Module({
    imports: [
        ...modules,
        RouterModule.register([
            {
                path: 'payment-system',
                module: PaymentSystemModule,
                children: [...modules],
            },
        ]),
    ],
    exports: [...modules],
})
export class PaymentSystemModule {}
