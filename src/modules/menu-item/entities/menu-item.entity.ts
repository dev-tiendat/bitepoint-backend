import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CommonEntity } from '~/common/entity/common.entity';
import { OrderItemEntity } from '~/modules/order/entities/order-item.entity';
import { CategoryEntity } from '~/modules/category/category.entity';

import { MenuItemStatus } from '../menu-item.constant';
import { MenuItemPriceEntity } from './menu-item-price.entity';

@Entity({ name: 'sys_menu_item' })
export class MenuItemEntity extends CommonEntity {
    @Column({ unique: true })
    @AutoMap()
    name: string;

    @Column({ length: 255 })
    @AutoMap()
    description: string;

    @Column({ length: 255 })
    @AutoMap()
    image: string;

    @Column({ type: 'tinyint' })
    @AutoMap()
    popular: number;

    @Column({ type: 'tinyint' })
    @AutoMap()
    status: MenuItemStatus;

    @AutoMap({ type: () => MenuItemPriceEntity })
    @OneToMany(
        () => MenuItemPriceEntity,
        menuItemPrice => menuItemPrice.menuItem,
        {
            cascade: true,
        }
    )
    historyPrices: MenuItemPriceEntity[];

    @ManyToOne(() => CategoryEntity, category => category.menuItems)
    @JoinColumn({ name: 'category_id' })
    category: CategoryEntity;

    @OneToMany(() => OrderItemEntity, orderItem => orderItem.menuItem)
    orderMenuItems: OrderItemEntity[];

    // @VirtualColumn({
    //     query: alias =>
    //         `SELECT price FROM sys_menu_item_price as item_price WHERE menu_item_id = item_price.id ORDER BY created_at DESC LIMIT 1`,
    // })
    // currentPrice: number;

    // @VirtualColumn({
    //     query: alias =>
    //         `SELECT id FROM sys_menu_item_price as item_price WHERE menu_item_id = item_price.id ORDER BY created_at DESC LIMIT 1`,
    // })
    // currentPriceId: number;
}
