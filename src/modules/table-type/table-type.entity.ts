import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToOne } from 'typeorm';

import { CommonEntity } from '~/common/entity/common.entity';
import { TableEntity } from '../table/table.entity';

@Entity({ name: 'sys_table_type' })
export class TableTypeEntity extends CommonEntity {
    @Column({ length: 70 })
    @AutoMap()
    name: string;

    @Column({ length: 255 })
    @AutoMap()
    image: string;

    @OneToOne(() => TableEntity, table => table.tableType)
    table: TableEntity;
}
