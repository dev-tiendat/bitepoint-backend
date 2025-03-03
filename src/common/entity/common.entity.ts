import { AutoMap } from '@automapper/classes';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VirtualColumn,
} from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @AutoMap()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

export abstract class CompleteEntity extends CommonEntity {
    @ApiHideProperty()
    @Exclude()
    @Column({ name: 'create_by', update: false, nullable: true })
    createBy: number;

    @ApiHideProperty()
    @Exclude()
    @Column({ name: 'update_by', nullable: true })
    updateBy: number;

    @VirtualColumn({
        query: alias =>
            `SELECT username FROM sys_user WHERE id = ${alias}.created_by`,
    })
    creator: string;

    @VirtualColumn({
        query: alias =>
            `SELECT username FROM sys_user WHERE id = ${alias}.updated_by`,
    })
    updater: string;
}
