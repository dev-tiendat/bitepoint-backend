import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { PaymentEntity } from '~/modules/payment-system/payment/payment.entity';
import { FeedBackEntity } from '~/modules/feedback/feedback.entity';
import { VoucherEntity } from '~/modules/voucher/voucher.entity';

import { UserEntity } from '../../user/user.entity';
import { TableEntity } from '../../table/table.entity';
import { ReservationEntity } from '../../reservation/reservation.entity';
import { OrderStatus } from '../order.constant';
import { OrderItemEntity } from './order-item.entity';
import { OrderGroupEntity } from './order-group.entity';

@Entity({ name: 'sys_order' })
export class OrderEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @AutoMap()
    id!: string;

    @Column({ name: 'order_time', nullable: true })
    @AutoMap()
    orderTime: Date;

    @Column({ name: 'total_price', nullable: true })
    @AutoMap()
    totalPrice: number;

    @Column({ name: 'status', type: 'tinyint', default: OrderStatus.ORDERING })
    @AutoMap()
    status: OrderStatus;

    @ManyToOne(() => UserEntity, user => user.orders)
    @JoinColumn({ name: 'customer_id' })
    @AutoMap(() => UserEntity)
    customer: UserEntity;

    @ManyToOne(() => OrderGroupEntity, orderGroup => orderGroup.orders)
    @JoinColumn({ name: 'order_group_id' })
    @AutoMap(() => OrderGroupEntity)
    orderGroup: OrderGroupEntity;

    @ManyToOne(() => TableEntity, table => table.orders)
    @JoinColumn({ name: 'table_id' })
    @AutoMap(() => TableEntity)
    table: TableEntity;

    @ManyToOne(() => ReservationEntity, reservation => reservation.orders)
    @JoinColumn({ name: 'reservation_id' })
    @AutoMap(() => ReservationEntity)
    reservation: ReservationEntity;

    @OneToMany(() => OrderItemEntity, orderItem => orderItem.order)
    @AutoMap(() => OrderItemEntity)
    orderItems: OrderItemEntity[];

    @OneToOne(() => PaymentEntity, payment => payment.order)
    payment: PaymentEntity;

    @OneToOne(() => FeedBackEntity, feedback => feedback.order)
    feedback: FeedBackEntity;

    @ManyToOne(() => VoucherEntity, voucher => voucher.orders)
    @JoinColumn({ name: 'voucher_id' })
    @AutoMap(() => VoucherEntity)
    voucher: VoucherEntity;
}
