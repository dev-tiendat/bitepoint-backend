import { ApiProperty } from '@nestjs/swagger';

import { MenuEntity } from './menu.entity';

export class MenuItemInfoAndParentInfo {
    @ApiProperty({ description: 'Menu hiện tại' })
    menu: MenuEntity;

    @ApiProperty({ description: 'Menu nút cha' })
    parentMenu: MenuEntity;
}
