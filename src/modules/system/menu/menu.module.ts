import { Module } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from './menu.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';

const providers = [MenuService];

@Module({
    imports: [TypeOrmModule.forFeature([MenuEntity]), RoleModule],
    controllers: [MenuController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class MenuModule {}
