import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderModule } from '~/modules/order/order.module';
import { UserModule } from '~/modules/user/user.module';
import { TableModule } from '~/modules/table/table.module';

import { GatewayModule } from '../gateway/gateway.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentEntity } from './payment.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentEntity]),
        GatewayModule,
        OrderModule,
        TableModule,
        UserModule,
    ],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [TypeOrmModule, PaymentService],
})
export class PaymentModule {}
