import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { MenuItemEntity } from '~/modules/menu-item/entities/menu-item.entity';

import { OrderItemStatus } from '../order.constant';
import { OrderEntity } from './order.entity';

@Entity({ name: 'sys_order_item' })
export class OrderItemEntity {
    @PrimaryGeneratedColumn()
    @AutoMap()
    id: number;

    @Column({ type: 'tinyint' })
    @AutoMap()
    quantity: number;

    @Column({ type: 'text', nullable: true })
    @AutoMap()
    note: string;

    @Column({ type: 'decimal', default: 0 })
    @AutoMap()
    price: number;

    @Column({ type: 'tinyint', default: OrderItemStatus.ORDERED })
    @AutoMap()
    status: OrderItemStatus;

    @Column({ name: 'urged', type: 'tinyint', default: 0 })
    @AutoMap()
    urged: number;

    @ManyToOne(() => MenuItemEntity, menuItem => menuItem.orderMenuItems)
    @JoinColumn({ name: 'menu_item_id' })
    @AutoMap(() => MenuItemEntity)
    menuItem: MenuItemEntity;

    @ManyToOne(() => OrderEntity, order => order.orderItems)
    @JoinColumn({ name: 'order_id' })
    @AutoMap(() => OrderEntity)
    order: OrderEntity;

    @CreateDateColumn({ name: 'created_at' })
    @AutoMap()
    createdAt: Date;
}
