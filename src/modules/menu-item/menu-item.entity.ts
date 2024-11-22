import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { CommonEntity } from '~/common/entity/common.entity';
import { MenuItemStatus } from './menu-item.constant';
import { CategoryEntity } from '../category/category.entity';

@Entity({ name: 'sys_menu_item' })
export class MenuItemEntity extends CommonEntity {
    @Column({ unique: true })
    name: string;

    @Column({ length: 255 })
    description: string;

    @Column({ type: 'bigint' })
    price: number;

    @Column({ length: 255 })
    image: string;

    @Column({ type: 'tinyint' })
    popular: number;

    @Column({ type: 'tinyint' })
    status: MenuItemStatus;

    @ManyToOne(() => CategoryEntity, category => category.menuItems)
    @JoinColumn({ name: 'category_id' })
    category: CategoryEntity;
}
