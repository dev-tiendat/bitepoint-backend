import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CommonEntity } from '~/common/entity/common.entity';

import { TableEntity } from '../table/table.entity';

@Entity({ name: 'sys_table_zone' })
export class TableZoneEntity extends CommonEntity {
    @Column({ length: 50, unique: true })
    @AutoMap()
    name: string;

    @AutoMap(() => TableEntity)
    @OneToMany(() => TableEntity, table => table.tableZone)
    tables: TableEntity[];
}
