import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { OrderEntity } from './order.entity';

@Entity({ name: 'sys_order_group' })
export class OrderGroupEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'customer_name', default: '' })
    customerName: string;

    @Column({ type: 'tinyint', name: 'guest_count', default: 1 })
    guestCount: number;

    @OneToMany(() => OrderEntity, order => order.orderGroup)
    orders: OrderEntity[];
}
