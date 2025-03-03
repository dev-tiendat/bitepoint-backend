import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToMany } from 'typeorm';

import { CommonEntity } from '~/common/entity/common.entity';

import { TableEntity } from '../table/table.entity';

@Entity({ name: 'sys_table_type' })
export class TableTypeEntity extends CommonEntity {
    @AutoMap()
    @Column({ length: 70 })
    name: string;

    @AutoMap()
    @Column({ length: 255 })
    image: string;

    @AutoMap()
    @Column({ type: 'tinyint', name: 'max_capacity', default: 1 })
    maxCapacity: number;

    @AutoMap()
    @OneToMany(() => TableEntity, table => table.tableType)
    table: TableEntity;
}
