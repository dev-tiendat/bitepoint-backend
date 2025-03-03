import { AutoMap } from '@automapper/classes';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderEntity } from '~/modules/order/entities/order.entity';
import { UserEntity } from '~/modules/user/user.entity';

@Entity({ name: 'sys_payment' })
export class PaymentEntity {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @Column({ name: 'transaction_id', nullable: true })
    transactionId: string;

    @AutoMap()
    @Column({ name: 'payment_method', type: 'tinyint' })
    paymentMethod: number;

    @AutoMap()
    @Column({ name: 'payment_status', type: 'tinyint' })
    paymentStatus: number;

    @AutoMap()
    @Column({ name: 'payment_time', nullable: true })
    paymentTime: Date;

    @AutoMap()
    @Column({ name: 'paid_amount' })
    paidAmount: number;

    @AutoMap(() => OrderEntity)
    @OneToOne(() => OrderEntity, order => order.payment)
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;

    @AutoMap(() => UserEntity)
    @ManyToOne(() => UserEntity, user => user.payments)
    @JoinColumn({ name: 'staff_id' })
    staff: UserEntity;
}
