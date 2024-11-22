import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '~/common/entity/common.entity';
import { MenuItemEntity } from '../menu-item/menu-item.entity';

@Entity({ name: 'sys_category' })
export class CategoryEntity extends CommonEntity {
    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @OneToMany(() => MenuItemEntity, menuItem => menuItem.category)
    menuItems: MenuItemEntity[];
}
