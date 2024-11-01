import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, Relation } from 'typeorm';
import { CompleteEntity } from '~/common/entity/common.entity';
import { UserEntity } from '~/modules/user/user.entity';

@Entity({ name: 'sys_role' })
export class RoleEntity extends CompleteEntity {
    @Column({ length: 50, unique: true })
    @ApiProperty({ description: 'Tên vai trò' })
    name: string;

    @Column({ unique: true })
    @ApiProperty({ description: 'ID vai trò' })
    value: string;

    @Column({ nullable: true })
    @ApiProperty({ description: 'Mô tả vai trò' })
    remark: string;

    @Column({ type: 'tinyint', nullable: true, default: 1 })
    @ApiProperty({ description: 'Trạng thái: 1 Bật, 0 Tắt' })
    status: number;

    @ApiHideProperty()
    @ManyToMany(() => UserEntity, user => user.roles)
    users: Relation<UserEntity[]>;
}
