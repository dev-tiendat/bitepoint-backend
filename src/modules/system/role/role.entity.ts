import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, Relation } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CompleteEntity } from '~/common/entity/common.entity';
import { UserEntity } from '~/modules/user/user.entity';

import { MenuEntity } from '../menu/menu.entity';

@Entity({ name: 'sys_role' })
export class RoleEntity extends CompleteEntity {
    @Column({ length: 50, unique: true })
    @AutoMap()
    @ApiProperty({ description: 'Tên vai trò' })
    name: string;

    @Column({ unique: true })
    @AutoMap()
    @ApiProperty({ description: 'ID vai trò' })
    value: string;

    @Column({ nullable: true })
    @AutoMap()
    @ApiProperty({ description: 'Mô tả vai trò' })
    remark: string;

    @Column({ type: 'tinyint', nullable: true, default: 1 })
    @AutoMap()
    @ApiProperty({ description: 'Trạng thái: 1 Bật, 0 Tắt' })
    status: number;

    @ApiHideProperty()
    @AutoMap(() => UserEntity)
    @ManyToMany(() => UserEntity, user => user.roles)
    users: Relation<UserEntity[]>;

    @ApiHideProperty()
    @ManyToMany(() => MenuEntity, menu => menu.roles, {})
    @JoinTable({
        name: 'sys_role_menus',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'menu_id',
            referencedColumnName: 'id',
        },
    })
    @AutoMap(() => MenuEntity)
    menus: Relation<MenuEntity[]>;
}
