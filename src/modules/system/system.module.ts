import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { UserModule } from '../user/user.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';

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
