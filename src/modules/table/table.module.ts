import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableEntity } from './table.entity';
import { TableService } from './table.service';
import { TableZoneModule } from '../table-zone/table-zone.module';
import { TableTypeModule } from '../table-type/table-type.module';

const providers = [TableService];

@Module({
    imports: [
        TypeOrmModule.forFeature([TableEntity]),
        forwardRef(() => TableZoneModule),
        TableTypeModule,
    ],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class TableModule {}
