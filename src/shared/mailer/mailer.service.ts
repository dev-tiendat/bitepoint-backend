import { Inject, Injectable } from '@nestjs/common';

import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import dayjs from 'dayjs';

import Redis from 'ioredis';

import { InjectRedis } from '~/common/decorators/inject-redis.decorator';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { AppConfig, IAppConfig } from '~/config';
import { ErrorCode } from '~/constants/error-code.constant';
import { randomValue } from '~/utils/tool.util';

@Injectable()
export class MailerService {
    constructor(
        @Inject(AppConfig.KEY) private appConfig: IAppConfig,
        @InjectRedis() private redis: Redis,
        private mailerService: NestMailerService
    ) {}

    async log(to: string, code: string, ip: string) {
        const getRemainTime = () => {
            const now = dayjs();
            return now.endOf('day').diff(now, 'second');
        };

        await this.redis.set(`otp:${to}`, code, 'EX', 60 * 5);

        const limitCountOfDay = await this.redis.get(`otp:${to}:limit-day`);
        const ipLimitCountOfDay = await this.redis.get(
            `ip:${ip}:send:limit-day`
        );

        await this.redis.set(`ip:${ip}:send:limit`, 1, 'EX', 60);
        await this.redis.set(`otp:${to}:limit`, 1, 'EX', 60);
        await this.redis.set(
            `otp:${to}:send:limit-count-day`,
            limitCountOfDay,
            'EX',
            getRemainTime()
        );
        await this.redis.set(
            `ip:${ip}:send:limit-count-day`,
            ipLimitCountOfDay,
            'EX',
            getRemainTime()
        );
    }

    async checkCode(to, code) {
        const ret = await this.redis.get(`otp:${to}`);
        if (ret !== code)
            throw new BusinessException(ErrorCode.INVALID_VERIFICATION_CODE);

        await this.redis.del(`otp:${to}`);
    }

    async checkLimit(to, ip) {
        const LIMIT_TIME = 5;

        const ipLimit = await this.redis.get(`ip:${ip}:send:limit`);
        if (ipLimit) throw new BusinessException(ErrorCode.TOO_MANY_REQUESTS);

        const limit = await this.redis.get(`otp:${to}:limit`);
        if (limit) throw new BusinessException(ErrorCode.TOO_MANY_REQUESTS);

        let limitCountOfDay: string | number = await this.redis.get(
            `otp:${to}:limit-day`
        );
        limitCountOfDay = limitCountOfDay ? Number(limitCountOfDay) : 0;
        if (limitCountOfDay > LIMIT_TIME) {
            throw new BusinessException(
                ErrorCode.MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY
            );
        }

        let ipLimitCountOfDay: string | number = await this.redis.get(
            `ip:${ip}:send:limit-day`
        );
        ipLimitCountOfDay = ipLimitCountOfDay ? Number(ipLimitCountOfDay) : 0;
        if (ipLimitCountOfDay > LIMIT_TIME) {
            throw new BusinessException(
                ErrorCode.MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY
            );
        }
    }

    async send(
        to,
        subject,
        content: string,
        type: 'text' | 'html' = 'text'
    ): Promise<any> {
        if (type === 'text') {
            return this.mailerService.sendMail({
                to,
                subject,
                text: content,
            });
        } else {
            return this.mailerService.sendMail({
                to,
                subject,
                html: content,
            });
        }
    }

    async sendOtp(to, otp = randomValue(4, '1234567890')) {
        const subject = `[${this.appConfig.name}] mã xác thực`;

        try {
            await this.mailerService.sendMail({
                to,
                subject,
                template: './forgot-password',
                context: {
                    otp,
                },
            });
        } catch (error) {
            console.log(error);
            throw new BusinessException(
                ErrorCode.VERIFICATION_CODE_SEND_FAILED
            );
        }

        return {
            to,
            otp,
        };
    }

    // async sendUserConfirmation(user: UserEntity, token: string) {
    //   const url = `example.com/auth/confirm?token=${token}`
    //   await this.mailerService.sendMail({
    //     to: user.email,
    //     subject: 'Confirm your Email',
    //     template: './confirmation',
    //     context: {
    //       name: user.name,
    //       url,
    //     },
    //   })
    // }
}
