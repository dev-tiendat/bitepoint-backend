import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToMany } from 'typeorm';

import { CommonEntity } from '~/common/entity/common.entity';
import { MenuItemEntity } from '../menu-item/entities/menu-item.entity';

@Entity({ name: 'sys_category' })
export class CategoryEntity extends CommonEntity {
    @Column({ unique: true })
    @AutoMap()
    name: string;

    @Column()
    @AutoMap()
    description: string;

    @Column()
    @AutoMap()
    image: string;

    @OneToMany(() => MenuItemEntity, menuItem => menuItem.category)
    @AutoMap(() => MenuItemEntity)
    menuItems: MenuItemEntity[];
}
