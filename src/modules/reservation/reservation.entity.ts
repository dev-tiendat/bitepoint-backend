import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CommonEntity } from '~/common/entity/common.entity';
import { DateField } from '~/common/decorators/field.decorator';

import { ReservationStatus } from './reservation.constant';
import { UserEntity } from '../user/user.entity';
import { OrderEntity } from '../order/entities/order.entity';

@Entity({ name: 'sys_reservation' })
export class ReservationEntity extends CommonEntity {
    @Column({ name: 'guest_count', type: 'tinyint' })
    @AutoMap()
    guestCount: number;

    @Column({
        name: 'customer_name',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    @AutoMap()
    customerName: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    @AutoMap()
    phone: string;

    @Column({ name: 'reservation_time' })
    @AutoMap()
    @DateField()
    reservationTime: Date;

    @Column({ name: 'special_requests', type: 'text', nullable: true })
    @AutoMap()
    specialRequest: string;

    @Column({
        name: 'status',
        type: 'tinyint',
        default: ReservationStatus.PENDING,
    })
    @AutoMap()
    status: ReservationStatus;

    @OneToMany(() => OrderEntity, order => order.reservation)
    @AutoMap(() => OrderEntity)
    orders: OrderEntity[];

    @ManyToOne(() => UserEntity, user => user.reservations)
    @JoinColumn({ name: 'user_id' })
    @AutoMap(() => UserEntity)
    user: UserEntity;
}
