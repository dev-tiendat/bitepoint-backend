import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuItemEntity } from './menu-item.entity';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';
import { CategoryModule } from '../category/category.module';
import { FileModule } from '../file/file.module';

const providers = [MenuItemService];

@Module({
    imports: [
        TypeOrmModule.forFeature([MenuItemEntity]),
        FileModule,
        CategoryModule,
    ],
    controllers: [MenuItemController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class MenuItemModule {}
