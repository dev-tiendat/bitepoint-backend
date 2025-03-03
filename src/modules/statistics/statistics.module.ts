import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { ReservationModule } from '../reservation/reservation.module';

const providers = [StatisticsService];

@Module({
    imports: [OrderModule, ReservationModule],
    controllers: [StatisticsController],
    providers: [...providers],
    exports: [...providers],
})
export class StatisticsModule {}
