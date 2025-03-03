import {
    Body,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { Ip } from '~/common/decorators/http.decorator';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthLoginResult } from './models/auth.model';
import { LocalGuard } from './guards/local.guard';
import { TokenService } from './services/token.service';
import { Public } from './decorators/public.decorator';

@UseGuards(LocalGuard)
@Controller({
    path: 'auth',
    version: '1',
})
@Public()
@ApiTags('Auth - Mô-đun xác thực')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private tokenService: TokenService
    ) {}

    @Post('register')
    @FormDataRequest()
    @ApiOperation({ summary: 'Đăng ký tài khoản cho khách hàng' })
    async register(@Body() dto: RegisterDto): Promise<void> {
        await this.userService.registerCustomerAccount(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @FormDataRequest()
    @ApiResult({ type: AuthLoginResult, status: HttpStatus.OK })
    @ApiOperation({ summary: 'Đăng nhập tài khoản' })
    async login(
        @Body() dto: LoginDto,
        @Ip() ip: string,
        // @Headers('user-gent') ua: string
    ): Promise<AuthLoginResult> {
        return this.authService.login(
            dto.usernameOrPhone,
            dto.password,
            ip,
            undefined
        );
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @FormDataRequest()
    @ApiResult({ type: String })
    @ApiOperation({ summary: 'Lấy Access Token mới khi hết hạn' })
    async refreshToken(@Body() dto: RefreshTokenDto): Promise<string> {
        return this.tokenService.refreshToken(dto.refreshToken);
    }
}
