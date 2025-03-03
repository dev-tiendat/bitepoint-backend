import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TableZoneModule } from '../table-zone/table-zone.module';
import { TableTypeModule } from '../table-type/table-type.module';
import { OrderModule } from '../order/order.module';
import { TableEntity } from './table.entity';
import { TableService } from './table.service';
import { TableProfile } from './table.profile';

const providers = [TableService, TableProfile];

@Module({
    imports: [
        TypeOrmModule.forFeature([TableEntity]),
        forwardRef(() => TableZoneModule),
        TableTypeModule,
        OrderModule,
    ],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class TableModule {}
