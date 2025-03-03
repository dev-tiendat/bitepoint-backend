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
import { AutoMap } from '@automapper/classes';
import { UserGender } from './user.constant';
import { RefreshTokenEntity } from '../auth/entities/refresh-token.entity';
import { FileEntity } from '../file/file.entity';
import { ReservationEntity } from '../reservation/reservation.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { PaymentEntity } from '../payment-system/payment/payment.entity';
import {
    NotificationEntity,
    NotificationUserEntity,
} from '../notification/notification.entity';

@Entity({ name: 'sys_user' })
export class UserEntity extends CommonEntity {
    @Column({ unique: true })
    @AutoMap()
    username: string;

    @Column()
    @Exclude()
    @AutoMap()
    password: string;

    @Column({ name: 'first_name' })
    @AutoMap()
    firstName: string;

    @Column({ name: 'last_name' })
    @AutoMap()
    lastName: string;

    @Column({ type: 'tinyint', default: '0' })
    @AutoMap(() => Number)
    gender: UserGender;

    @Column({ name: 'birth_date' })
    @AutoMap()
    birthDate: Date;

    @Column({ nullable: true })
    @AutoMap()
    avatar: string;

    @Column({ nullable: true })
    @AutoMap()
    email: string;

    @Column({ nullable: true })
    @AutoMap()
    phone: string;

    @Column({ nullable: true })
    @AutoMap()
    remark: string;

    @Column({ length: 32 })
    @AutoMap()
    psalt: string;

    @Column({ type: 'tinyint', nullable: true, default: 1 })
    @AutoMap()
    status: number;

    @ManyToMany(() => RoleEntity, role => role.users)
    @JoinTable({
        name: 'sys_user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    @AutoMap(() => RoleEntity)
    roles: Relation<RoleEntity[]>;

    @OneToMany(() => RefreshTokenEntity, refreshToken => refreshToken.user, {
        cascade: true,
    })
    @AutoMap(() => RefreshTokenEntity)
    refreshTokens: RefreshTokenEntity[];

    @OneToMany(() => FileEntity, file => file.user)
    files: FileEntity[];

    @OneToMany(() => ReservationEntity, reservation => reservation.user)
    reservations: ReservationEntity[];

    @OneToMany(() => OrderEntity, order => order.customer)
    orders: OrderEntity;

    @OneToMany(() => PaymentEntity, payment => payment.staff)
    payments: PaymentEntity[];

    @OneToMany(
        () => NotificationUserEntity,
        notificationUser => notificationUser.user
    )
    notificationUsers: NotificationUserEntity[];
}
