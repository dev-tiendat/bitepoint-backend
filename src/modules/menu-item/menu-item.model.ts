import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import { CommonModel } from '~/common/model/response.model';

export class MenuItemInfo {
    @AutoMap()
    @ApiProperty({ description: 'ID món ăn' })
    id: number;

    @AutoMap()
    @ApiProperty({ description: 'Tên món ăn' })
    name: string;

    @AutoMap()
    @ApiProperty({ description: 'Giá' })
    price: number;

    @AutoMap()
    @ApiProperty({ description: 'Mô tả' })
    description: string;

    @AutoMap()
    @ApiProperty({ description: 'Hình ảnh' })
    image: string;

    @AutoMap()
    @ApiProperty({ description: 'Món ăn phổ biến' })
    popular: number;
}

export class MenuItemPriceDetail {
    @AutoMap()
    @ApiProperty({ description: 'ID' })
    id: number;

    @AutoMap()
    @ApiProperty({ description: 'Giá' })
    price: number;

    @AutoMap()
    @ApiProperty({ description: 'Ngày tạo' })
    createAt: number;
}

export class MenuItemDetail extends CommonModel {
    @AutoMap()
    @ApiProperty({ description: 'Tên món ăn' })
    name: string;

    @AutoMap()
    @ApiProperty({ description: 'Giá' })
    currentPrice: number;

    @AutoMap()
    @ApiProperty({ description: 'Mô tả' })
    description: string;

    @AutoMap()
    @ApiProperty({ description: 'Hình ảnh' })
    image: string;

    @AutoMap()
    @ApiProperty({ description: 'Món ăn phổ biến' })
    popular: number;

    @AutoMap()
    @ApiProperty({ description: 'Trạng thái' })
    status: number;

    @AutoMap()
    @ApiProperty({ description: 'Danh mục' })
    categoryId: number;

    @AutoMap()
    @ApiProperty({ description: 'Danh mục' })
    historyPrices: MenuItemPriceDetail[];
}
