import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountInfo } from '~/modules/user/user.model';
import { UserService } from '~/modules/user/user.service';
import { AllowAnon } from '../decorators/allow-anon.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { AuthUser } from '../decorators/auth-user.decorator';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { AuthService } from '../auth.service';
import { FastifyRequest } from 'fastify';
import { AccountUpdateDto, PasswordUpdateDto } from '../dto/auth.dto';

@Controller({
    path: 'account',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Account - Mô dun tài khoản')
export class AccountController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    @Get('profile')
    @AllowAnon()
    @ApiResult({ type: AccountInfo })
    @ApiOperation({ summary: 'Lấy thông tin tài khoản' })
    async profile(@AuthUser('uid') uid: number): Promise<AccountInfo> {
        return this.userService.getAccountInfo(uid);
    }

    @Get('logout')
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
        // return this.authService;
    }

    @Put('update')
    @AllowAnon()
    @ApiOperation({ summary: 'Cập nhật thông tin tài khoản' })
    async update(
        @AuthUser('uid') uid: number,
        @Body() dto: AccountUpdateDto
    ): Promise<void> {
        await this.userService.updateAccountInfo(uid, dto);
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
}
