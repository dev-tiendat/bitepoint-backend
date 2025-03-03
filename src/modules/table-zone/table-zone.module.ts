import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TableModule } from '../table/table.module';
import { OrderModule } from '../order/order.module';
import { TableZoneController } from './table-zone.controller';
import { TableZoneService } from './table-zone.service';
import { TableZoneEntity } from './table-zone.entity';
import { TableZoneProfile } from './table-zone.profile';

const providers = [TableZoneService, TableZoneProfile];

@Module({
    imports: [
        TypeOrmModule.forFeature([TableZoneEntity]),
        forwardRef(() => TableModule),
        OrderModule,
    ],
    controllers: [TableZoneController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class TableZoneModule {}
