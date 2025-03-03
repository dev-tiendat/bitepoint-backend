import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { MenuItemEntity } from './menu-item.entity';

@Entity({ name: 'sys_menu_item_price' })
export class MenuItemPriceEntity extends BaseEntity {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @Column({ type: 'decimal', default: 0 })
    price: number;

    @AutoMap()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => MenuItemEntity, menuItem => menuItem.historyPrices)
    @JoinColumn({ name: 'menu_item_id' })
    menuItem: MenuItemEntity;
}
