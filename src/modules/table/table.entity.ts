import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CommonEntity } from '~/common/entity/common.entity';

import { TableZoneEntity } from '../table-zone/table-zone.entity';
import { TableTypeEntity } from '../table-type/table-type.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { TableStatus } from './table.constant';


@Entity({ name: 'sys_table' })
export class TableEntity extends CommonEntity {
    @AutoMap()
    @Column({ length: 70, unique: true })
    name: string;

    @AutoMap()
    @Column({ type: 'tinyint', default: TableStatus.AVAILABLE })
    status: TableStatus;

    @AutoMap()
    @Column({ type: 'tinyint', default: 0 })
    show: number;

    @ManyToOne(() => TableZoneEntity, tableZone => tableZone.tables)
    @JoinColumn({ name: 'table_zone_id' })
    @AutoMap(() => TableZoneEntity)
    tableZone: TableZoneEntity;

    @ManyToOne(() => TableTypeEntity, tableType => tableType.table)
    @JoinColumn({ name: 'table_type_id' })
    @AutoMap(() => TableTypeEntity)
    tableType: TableTypeEntity;

    @OneToMany(() => OrderEntity, order => order.table)
    @AutoMap()
    orders: OrderEntity[];
}
