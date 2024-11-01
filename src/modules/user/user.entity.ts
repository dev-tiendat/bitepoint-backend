import { Exclude } from 'class-transformer';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    Relation,
} from 'typeorm';
import { CommonEntity } from '~/common/entity/common.entity';
import { RoleEntity } from '../system/role/role.entity';
import { AccessTokenEntity } from '../auth/entities/access-token.entity';

@Entity({ name: 'sys_user' })
export class UserEntity extends CommonEntity {
    @Column({ unique: true })
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ type: 'tinyint', default: '0' })
    gender: number;

    @Column({ name: 'birth_date' })
    birthDate: Date;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    remark: string;

    @Column({ length: 32 })
    psalt: string;

    @Column({ type: 'tinyint', nullable: true, default: 1 })
    status: number;

    @ManyToMany(() => RoleEntity, role => role.users)
    @JoinTable({
        name: 'sys_user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Relation<RoleEntity[]>;

    @OneToMany(() => AccessTokenEntity, accessToken => accessToken.user, {
        cascade: true,
    })
    accessTokens: AccessTokenEntity[];
}
