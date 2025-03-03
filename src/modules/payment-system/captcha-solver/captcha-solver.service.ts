import { Injectable } from '@nestjs/common';
import { Solver } from '@2captcha/captcha-solver';
import { ConfigService } from '@nestjs/config';

import { ConfigKeyPaths } from '~/config';

@Injectable()
export class CaptchaSolverService {
    constructor(private configService: ConfigService<ConfigKeyPaths>) {}

    async solveCaptcha(base64: string): Promise<string> {
        const apiKey = this.configService.get('payment.captchaApiKey');

        const solver = new Solver(apiKey, 10);
        const captchaTextResolver = await solver.imageCaptcha({
            body: base64,
            max_len: 6,
            regsense: 1,
        });

        if (!captchaTextResolver.data)
            throw new Error('Captcha solving failed');

        return captchaTextResolver.data;
    }
}
