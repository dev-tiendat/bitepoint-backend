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
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

export abstract class CompleteEntity extends CommonEntity {
    @ApiHideProperty()
    @Exclude()
    @Column({ name: 'created_by', update: false, nullable: true })
    createdBy: number;

    @ApiHideProperty()
    @Exclude()
    @Column({ name: 'updated_by', nullable: true })
    updatedBy: number;

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
    ƒ;
}
