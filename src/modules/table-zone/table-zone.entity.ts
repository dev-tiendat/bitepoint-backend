import { Column, Entity, OneToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CommonEntity } from '~/common/entity/common.entity';
import { TableEntity } from '../table/table.entity';

@Entity({ name: 'sys_table_zone' })
export class TableZoneEntity extends CommonEntity {
    @Column({
        name: 'zone_name',
        unique: true,
    })
    @AutoMap()
    zoneName: string;

    @OneToOne(() => TableEntity, table => table.tableZone)
    table: TableEntity;
}
