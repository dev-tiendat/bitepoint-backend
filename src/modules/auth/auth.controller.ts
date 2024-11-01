import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { AccountInfo } from '../user/user.model';
import { ApiResult } from '~/common/decorators/api.result.decorator';

@ApiTags('Auth - Mô-đun xác thực')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Đăng ký tài khoản cho khách hàng' })
    async register(@Body() dto: RegisterDto) {
        const newUser = await this.userService.registerCustomerAccount(dto);

        return newUser;
    }

    @Get()
    @ApiResult({ type: AccountInfo })
    async get(): Promise<AccountInfo> {
        return this.userService.getAccountInfo(27);
    }
}
