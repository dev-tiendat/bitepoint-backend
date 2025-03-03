import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import { CommonModel } from '~/common/model/response.model';

import { MenuItemInfo } from '../menu-item/menu-item.model';

export class CategoryDetail extends CommonModel {
    @ApiProperty({ description: 'Tên danh mục' })
    @AutoMap()
    name: string;

    @ApiProperty({ description: 'Mô tả danh mục' })
    @AutoMap()
    description: string;

    @ApiProperty({ description: 'Hình ảnh danh mục' })
    @AutoMap()
    image: string;
}

export class OrderCategory {
    @ApiProperty({ description: 'ID danh mục' })
    @AutoMap()
    id: number;

    @ApiProperty({ description: 'Tên danh mục' })
    @AutoMap()
    name: string;

    @ApiProperty({ description: 'Mô tả danh mục' })
    @AutoMap()
    description: string;

    @ApiProperty({ description: 'Hình ảnh danh mục' })
    @AutoMap()
    image: string;

    @ApiProperty({ description: 'Số lượng món ăn' })
    @AutoMap()
    menuItemCount: number;

    @ApiProperty({ description: 'Danh sách món ăn' })
    @AutoMap(() => MenuItemInfo)
    menuItems: MenuItemInfo[];
}
