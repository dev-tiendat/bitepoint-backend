import { Body, Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AccountInfo } from '~/modules/user/user.model';
import { UserService } from '~/modules/user/user.service';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';

import { AllowAnon } from '../decorators/allow-anon.decorator';
import { AuthUser } from '../decorators/auth-user.decorator';
import { AuthService } from '../auth.service';
import { AccountUpdateDto, PasswordUpdateDto } from '../dto/auth.dto';
import { OrderService } from '~/modules/order/order.service';
import { FormDataRequest } from 'nestjs-form-data';
import { LoginLogService } from '~/modules/system/log/services/login-log.service';
import { PagerDto } from '~/common/dto/pager.dto';

@Controller({
    path: 'account',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Account - Mô dun tài khoản')
export class AccountController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private orderService: OrderService,
        private loginLogService: LoginLogService
    ) {}

    @Get('profile')
    @AllowAnon()
    @ApiResult({ type: AccountInfo })
    @ApiOperation({ summary: 'Lấy thông tin tài khoản' })
    async profile(@AuthUser('uid') uid: number): Promise<AccountInfo> {
        return this.userService.getAccountInfo(uid);
    }

    @Post('logout')
    @AllowAnon()
    @ApiOperation({ summary: 'Đăng xuất tài khoản' })
    async logout(
        @AuthUser() user: IAuthUser,
        @Req() req: FastifyRequest
    ): Promise<void> {
        await this.authService.clearLoginStatus(user, req.accessToken);
    }

    @Get('permissions')
    @AllowAnon()
    @ApiResult({ type: [String] })
    @ApiOperation({ summary: 'Lấy tất cả quyền của tài khoản' })
    async permissions(@AuthUser('uid') uid: number): Promise<string[]> {
        return this.authService.getPermissions(uid);
    }

    @Get('menus')
    @AllowAnon()
    @ApiOperation({ summary: 'Lấy danh sách menu ' })
    async menu(@AuthUser('uid') uid: number) {
        return this.authService.getMenus(uid);
    }

    @Put('update')
    @AllowAnon()
    @FormDataRequest()
    @ApiOperation({ summary: 'Cập nhật thông tin tài khoản' })
    async update(
        @AuthUser('uid') uid: number,
        @Body() dto: AccountUpdateDto
    ): Promise<AccountInfo> {
        return this.userService.updateAccountInfo(uid, dto);
    }

    @Post('password')
    @AllowAnon()
    @ApiOperation({ summary: 'Đổi mật khẩu' })
    async password(
        @AuthUser() user: IAuthUser,
        @Body() dto: PasswordUpdateDto,
        @Req() req: FastifyRequest
    ): Promise<void> {
        await this.userService.updatePassword(user, req.accessToken, dto);
    }

    @Get('order-history')
    @AllowAnon()
    @ApiOperation({ summary: 'Lấy lịch sử đơn hàng' })
    async orderHistory(@AuthUser('uid') uid: number) {
        return this.orderService.getOrderHistory(uid);
    }

    @Get('login-logs')
    @AllowAnon()
    @ApiOperation({ summary: 'Lấy lịch sử đăng nhập' })
    async loginLogs(@AuthUser('uid') uid: number, @Query() query: PagerDto) {
        return this.loginLogService.listByUid(uid, query);
    }
}
