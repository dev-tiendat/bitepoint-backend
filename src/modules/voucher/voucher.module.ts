import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherEntity } from './voucher.entity';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { VoucherProfile } from './voucher.profile';
import { OrderModule } from '../order/order.module';

const providers = [VoucherService, VoucherProfile];

@Module({
    imports: [TypeOrmModule.forFeature([VoucherEntity]), OrderModule],
    controllers: [VoucherController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class VoucherModule {}
