import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderModule } from '../order/order.module';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationEntity } from './reservation.entity';
import { ReservationProfile } from './reservation.profile';

const providers = [ReservationService, ReservationProfile];

@Module({
    imports: [TypeOrmModule.forFeature([ReservationEntity]), OrderModule],
    controllers: [ReservationController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class ReservationModule {}
