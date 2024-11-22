import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';
import { RouterModule } from '@nestjs/core';
import { UserModule } from '../user/user.module';

const modules = [MenuModule, RoleModule, UserModule];
@Module({
    imports: [
        ...modules,
        RouterModule.register([
            {
                path: 'system',
                module: SystemModule,
                children: [...modules],
            },
        ]),
    ],
    exports: [...modules],
})
export class SystemModule {}
