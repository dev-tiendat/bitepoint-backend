import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { Ip } from '~/common/decorators/http.decorator';

import { MailerService } from '~/shared/mailer/mailer.service';

import { Public } from '../decorators/public.decorator';
import { ForgotPasswordDto } from '../dto/email.dto';

@ApiTags('Auth - Email')
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class EmailController {
    constructor(private mailerService: MailerService) {}

    @Post('forgot-password')
    @ApiOperation({ summary: 'Quên mật khẩu' })
    @Public()
    @Throttle({ default: { limit: 2, ttl: 600000 } })
    async sendEmailCode(
        @Body() dto: ForgotPasswordDto,
        @Ip() ip: string
    ): Promise<void> {
        const { email } = dto;

        const { otp } = await this.mailerService.sendOtp(email);

        await this.mailerService.log(email, otp, ip);
    }
}
