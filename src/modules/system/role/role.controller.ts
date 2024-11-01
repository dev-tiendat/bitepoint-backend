import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller({
    path: 'roles',
    version: '1',
})
export class RoleController {
    constructor(private roleService: RoleService) {}

    @Get()
    async list() {
        return this.roleService.list();
    }
}
