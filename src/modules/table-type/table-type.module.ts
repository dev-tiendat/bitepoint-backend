import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '../file/file.module';
import { TableTypeEntity } from './table-type.entity';
import { TableTypeService } from './table-type.service';
import { TableTypeProfile } from './table-type.profile';
import { TableTypeController } from './table-type.controller';

const providers = [TableTypeService, TableTypeProfile];

@Module({
    imports: [TypeOrmModule.forFeature([TableTypeEntity]), FileModule],
    controllers: [TableTypeController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class TableTypeModule {}
