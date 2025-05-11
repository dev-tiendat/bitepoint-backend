import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuModule } from '../menu/menu.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleEntity } from './role.entity';
import { RoleProfile } from './role.profile';

const providers = [RoleService, RoleProfile];

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleEntity]),
        forwardRef(() => MenuModule),
    ],
    controllers: [RoleController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class RoleModule {}
