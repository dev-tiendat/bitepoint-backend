import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import {
    definePermission,
    Perm,
} from '~/modules/auth/decorators/permission.decorator';
import { CreatorPipe } from '~/common/pipes/creator.pipe';
import { IdParam } from '~/common/decorators/id-param.decorator';

import { RoleDto } from './role.model';
import { RoleService } from './role.service';

const permissions = definePermission('system:role', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    DELETE: 'delete',
    UPDATE: 'update',
});

@ApiTags('Role - Quản lý vai trò')
@ApiSecurityAuth()
@Controller({
    path: 'roles',
    version: '1',
})
export class RoleController {
    constructor(private roleService: RoleService) {}

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách tất cả vai trò' })
    @Perm(permissions.LIST)
    async list() {
        return this.roleService.list();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin vai trò' })
    @Perm(permissions.READ)
    async info(@IdParam() id: number) {
        return this.roleService.info(id);
    }

    @Post()
    @ApiOperation({ summary: 'Tạo mới vai trò' })
    @Perm(permissions.CREATE)
    @FormDataRequest()
    async create(@Body(CreatorPipe) dto: RoleDto) {
        await this.roleService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật vai trò' })
    @Perm(permissions.UPDATE)
    @FormDataRequest()
    async update(@IdParam() id: number, @Body() dto: RoleDto) {
        await this.roleService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa vai trò' })
    @Perm(permissions.DELETE)
    async delete(@IdParam() id: number) {
        if (await this.roleService.checkUserByRoleId(id))
            return new BadRequestException(
                'This role has associated users and cannot be deleted'
            );

        await this.roleService.delete(id);
    }
}
