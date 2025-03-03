import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleModule } from '../role/role.module';
import { MenuEntity } from './menu.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';

const providers = [MenuService];

@Module({
    imports: [
        TypeOrmModule.forFeature([MenuEntity]),
        forwardRef(() => RoleModule)
    ],
    controllers: [MenuController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class MenuModule {}
