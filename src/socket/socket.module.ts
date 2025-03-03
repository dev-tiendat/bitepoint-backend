import { Module, Provider } from '@nestjs/common';
import { TableEventsGateway } from './events/table.gateway';
import { TableModule } from '~/modules/table/table.module';
import { TableZoneModule } from '~/modules/table-zone/table-zone.module';
import { OrderModule } from '~/modules/order/order.module';
import { OrderEventsGateway } from './events/order.gateway';
import { ReservationModule } from '~/modules/reservation/reservation.module';
import { AuthModule } from '~/modules/auth/auth.module';
import { PaymentModule } from '~/modules/payment-system/payment/payment.module';
import { PaymentEventsGateway } from './events/payment.gateway';

const providers: Provider[] = [
    TableEventsGateway,
    OrderEventsGateway,
    PaymentEventsGateway,
];

@Module({
    imports: [
        AuthModule,
        TableModule,
        OrderModule,
        ReservationModule,
        PaymentModule,
    ],
    providers,
    exports: [...providers],
})
export class SocketModule {}
