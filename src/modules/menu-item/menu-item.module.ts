import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from '../category/category.module';
import { FileModule } from '../file/file.module';
import { MenuItemEntity } from './entities/menu-item.entity';
import { MenuItemPriceEntity } from './entities/menu-item-price.entity';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';
import { MenuItemProfile } from './menu-item.profile';


const providers = [MenuItemService, MenuItemProfile];

@Module({
    imports: [
        TypeOrmModule.forFeature([MenuItemEntity, MenuItemPriceEntity]),
        FileModule,
        CategoryModule,
    ],
    controllers: [MenuItemController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class MenuItemModule {}
