import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import * as playwright from 'playwright';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { axios } from '~/helper/axios';
import { sleep } from '~/helper/sleep';

import { Gateway } from '../gateway.service';
import { GateWayType, Payment } from '../gateway.interface';

interface MbBankTransactionDto {
    refNo: string;
    result: { responseCode: string; message: string; ok: boolean };
    transactionHistoryList: {
        postingDate: string;
        transactionDate: string;
        accountNo: string;
        creditAmount: string;
        debitAmount: string;
        currency: 'VND';
        description: string;
        availableBalance: string;
        beneficiaryAccount: null;
        refNo: string;
        benAccountName: string;
        bankName: string;
        benAccountNo: string;
        dueDate: null;
        docId: null;
        transactionType: string;
    }[];
}

@Injectable()
export class MBBankService extends Gateway {
    private sessionId: string | null | undefined;
    private deviceId: string = '';

    getAgent() {
        if (this.proxy != null) {
            if (this.proxy.username && this.proxy.username.length > 0) {
                return new HttpsProxyAgent(
                    `${this.proxy.schema}://${this.proxy.username}:${this.proxy.password}@${this.proxy.ip}:${this.proxy.port}`
                );
            }
            return new HttpsProxyAgent(
                `${this.proxy.schema}://${this.proxy.ip}:${this.proxy.port}`
            );
        }
        return undefined;
    }

    getChromProxy() {
        if (!this.proxy) {
            return undefined;
        }

        return {
            server: `${this.proxy.ip}:${this.proxy.port}`,
            username: this.proxy.username,
            password: this.proxy.password,
        };
    }

    private async login() {
        const browser = await playwright.chromium.launch({
            headless: true,
            proxy: this.getChromProxy(),
        });
        try {
            const context = await browser.newContext();
            const page = await context.newPage();

            console.log('Mb bank login...');

            if (this.proxy)
                await page.route('**/*', async route => {
                    const url = route.request().url();
                    const resourceType = route.request().resourceType();

                    if (
                        url.includes(
                            '/retail-web-internetbankingms/getCaptchaImage'
                        )
                    )
                        return route.continue();

                    if (['image', 'media'].includes(resourceType)) {
                        return route.abort();
                    }

                    if (![`xhr`, `fetch`, `document`].includes(resourceType)) {
                        try {
                            const response = await axios.get(url, {
                                responseType: 'arraybuffer',
                            });
                            return route.fulfill({
                                status: response.status,
                                headers: response.headers as any,
                                body: response.data,
                            });
                        } catch (error) {
                            return route.abort();
                        }
                    }
                    route.continue();
                });

            const getCaptchaWaitResponse = page.waitForResponse(
                '**/retail-web-internetbankingms/getCaptchaImage',
                { timeout: 60000 }
            );
            await page.goto('https://online.mbbank.com.vn/pl/login');

            const getCaptchaJson = await getCaptchaWaitResponse.then(d =>
                d.json()
            );

            const captchaText = await this.captchaSolverService.solveCaptcha(
                getCaptchaJson.imageString
            );

            await page.locator('#form1').getByRole('img').click();
            await page.getByPlaceholder('Tên đăng nhập').click();
            await page
                .getByPlaceholder('Tên đăng nhập')
                .fill(this.config.loginId);
            await page.getByPlaceholder('Tên đăng nhập').press('Tab');
            await page
                .getByPlaceholder('Nhập mật khẩu')
                .fill(this.config.password);
            await page.getByPlaceholder('NHẬP MÃ KIỂM TRA').click();
            await page.getByPlaceholder('NHẬP MÃ KIỂM TRA').fill(captchaText);

            const loginWaitResponse = page.waitForResponse(
                new RegExp('.*doLogin$', 'g')
            );
            await sleep(1000);
            await page.getByRole('button', { name: 'Đăng nhập' }).click();

            const loginJson = await loginWaitResponse.then(d => d.json());

            if (loginJson.result.responseCode == 'GW283') {
                throw new Error('Wrong captcha');
                //
            }
            if (!loginJson.result.ok)
                throw new Error(loginJson.result.message.message);

            this.sessionId = loginJson.sessionId;
            this.deviceId = loginJson.cust.deviceId;
            await browser.close();
            console.log('MBBankService login success');
        } catch (error) {
            await browser.close();
            console.error('MBBankService login error', error);
            throw error;
        }
    }

    async getHistory(): Promise<Payment[]> {
        if (!this.sessionId) await this.login();

        const fromDate = moment()
            .tz('Asia/Ho_Chi_Minh')
            .subtract(this.config.getTransactionDayLimit, 'days')
            .format('DD/MM/YYYY');
        const toDate = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
        const refNo =
            this.config.account.toUpperCase() +
            moment().tz('Asia/Ho_Chi_Minh').format('DDMMYYYYHHmmssSSS');
        const dataSend = {
            accountNo: this.config.account,
            fromDate,
            toDate,
            sessionId: this.sessionId,
            refNo,
            deviceIdCommon: this.deviceId,
        };
        try {
            const { data } = await axios.post<MbBankTransactionDto>(
                'https://online.mbbank.com.vn/api/retail-transactionms/transactionms/get-account-transaction-history',

                dataSend,
                {
                    headers: {
                        'X-Request-Id': moment()
                            .tz('Asia/Ho_Chi_Minh')
                            .format('DDMMYYYYHHmmssSSS'),
                        'Cache-Control': 'no-cache',
                        Accept: 'application/json, text/plain, */*',
                        Authorization:
                            'Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm',
                        Deviceid: this.deviceId,
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                        Origin: 'https://online.mbbank.com.vn',
                        Referer: 'https://online.mbbank.com.vn/',
                        Refno: refNo,
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    httpsAgent: this.getAgent(),
                }
            );

            if (data.result.responseCode === 'GW200') {
                throw new Error('Session expired');
            }

            if (!data.result.ok) throw new Error(data.result.message);

            if (
                !data.transactionHistoryList ||
                data.transactionHistoryList.length < 1
            ) {
                return [];
            }

            return data.transactionHistoryList.map(transaction => ({
                transaction_id: 'mbbank-' + transaction.refNo,
                amount: Number(transaction.creditAmount),
                content: transaction.description,
                date: moment
                    .tz(
                        transaction.transactionDate,
                        'DD/MM/YYYY HH:mm:ss',
                        'Asia/Ho_Chi_Minh'
                    )
                    .toDate(),

                account_receiver: transaction.accountNo,
                gate: GateWayType.MB_BANK,
            }));
        } catch (error) {
            console.error(error);

            try {
                if (
                    error.message.includes(
                        'Client network socket disconnected before secure TLS connection was established'
                    )
                ) {
                    await sleep(10000);
                } else {
                    await this.login();
                }
            } catch (error) {
                console.error(error);
            }

            throw error;
        }
    }
}
