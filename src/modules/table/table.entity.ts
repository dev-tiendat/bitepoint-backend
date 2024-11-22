import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { CommonEntity } from '~/common/entity/common.entity';
import { TableStatus } from './table.constant';
import { TableZoneEntity } from '../table-zone/table-zone.entity';
import { TableTypeEntity } from '../table-type/table-type.entity';

@Entity({ name: 'sys_table' })
export class TableEntity extends CommonEntity {
    @Column({ name: 'table_name', length: 70, unique: true })
    tableName: string;

    @Column({ type: 'tinyint', default: 0 })
    status: TableStatus;

    @Column({ type: 'tinyint' })
    show: number;

    @OneToOne(() => TableZoneEntity, tableZone => tableZone.table)
    @JoinColumn({ name: 'table_zone_id' })
    tableZone: TableZoneEntity;

    @OneToOne(() => TableTypeEntity, tableType => tableType.table)
    @JoinColumn({ name: 'table_type_id' })
    tableType: TableTypeEntity;
}
