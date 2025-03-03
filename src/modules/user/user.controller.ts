import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserDto, UserQueryDto } from './dto/user.dto';
import { UserService } from './user.service';
import { FormDataRequest } from 'nestjs-form-data';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import {
    definePermission,
    Perm,
} from '../auth/decorators/permission.decorator';
import { UserEntity } from './user.entity';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';

export const permissions = definePermission('system:user', {
    LIST: 'list',
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',

    PASSWORD_UPDATE: 'password:update',
    PASSWORD_RESET: 'pass:reset',
} as const);

@Controller({
    path: 'users',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('User - Mô đun quản lý người dùng')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách người dùng' })
    @ApiResult({ type: [UserEntity], isPage: true })
    @Perm(permissions.LIST)
    async list(@Query() dto: UserQueryDto) {
        return this.userService.list(dto);
    }

    @Post()
    @ApiOperation({ summary: 'Tạo mới người dùng' })
    @FormDataRequest()
    @Perm(permissions.CREATE)
    async create(@Body() dto: UserDto) {
        return this.userService.create(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin chi tiết người dùng' })
    @Perm(permissions.READ)
    async detail(@IdParam() id: number) {
        return this.userService.info(id);
    }

    @ApiOperation({ summary: 'Kích hoạt người dùng' })
    @Post(':id/active')
    @Perm(permissions.UPDATE)
    async active(@IdParam() id: number) {
        return this.userService.active(id);
    }

    @ApiOperation({ summary: 'Huỷ kích hoạt người dùng' })
    @Post(':id/deactive')
    @Perm(permissions.UPDATE)
    async deactive(@IdParam() id: number) {
        return this.userService.deactive(id);
    }
}
