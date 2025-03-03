import { Column, Entity } from "typeorm";

import { CommonEntity } from "~/common/entity/common.entity";

@Entity({ name: 'sys_config' })
export class ParamConfigEntity extends CommonEntity{
    @Column({type: 'varchar', length: 50})
    name: string;

    @Column({type: 'varchar', length: 50})
    key: string;

    @Column({type: 'varchar', nullable: true})
    value: string;

    @Column({type: 'varchar', nullable: true})
    remark: string;
}