import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { sleep } from '~/helper/sleep';
import { EventBusEvents } from '~/constants/event-bus.constant';

import { CaptchaSolverService } from '../captcha-solver/captcha-solver.service';
import { ProxyService } from '../proxy/proxy.service';
import { ProxyConfig } from '../proxy/proxy.interfaces';
import { GateConfig, Payment } from './gateway.interface';

export abstract class Gateway {
    private isCronRunning: boolean = true;
    private logger = new Logger(Gateway.name);
    protected proxy: ProxyConfig;

    constructor(
        protected config: GateConfig,
        protected eventEmitter: EventEmitter2,
        protected captchaSolverService: CaptchaSolverService,
        protected readonly proxyService: ProxyService
    ) {
        this.cron();
    }

    abstract getHistory(): Promise<Payment[]>;

    getName() {
        return this.config.name;
    }

    getConfig() {
        return this.config;
    }

    async getProxyAgent() {
        const httpsAgent = await this.proxyService.getProxyAgent(
            this.config.proxy
        );
        return httpsAgent;
    }

    async getHistoryAndPublish() {
        this.proxy = null;
        if (this.config.proxy && this.config.proxy.length > 0) {
            this.proxy = await this.proxyService.getProxy(this.config.proxy);
        }
        const payments = await this.getHistory();

        this.eventEmitter.emit(EventBusEvents.PaymentHistoryUpdated, payments);
        this.logger.log(
            JSON.stringify({
                label: 'CronInfo',
                type: this.config.type,
                payments: payments.length,
            })
        );
    }

    private errorStreak = 0;
    private isErrored = false;
    private async handleError(error: any) {
        this.logger.error(this.getName() + error);
        await sleep(1000);
        this.errorStreak++;
        this.logger.error(error);
        if (this.errorStreak > 5) {
            this.isErrored = true;
            this.stopCron();
            this.eventEmitter.emit(EventBusEvents.GatewayCronErrorStreak, {
                name: this.getName(),
                error: error.message,
            });
            setTimeout(
                () => {
                    this.errorStreak = 0;
                    this.startCron();
                },
                5 * 60 * 1000
            );
        }
    }

    async cron() {
        while (true) {
            if (!this.isCronRunning) {
                await sleep(5000);
                continue;
            }

            try {
                await this.getHistoryAndPublish();

                if (this.isErrored) {
                    this.eventEmitter.emit(EventBusEvents.GatewayCronRecovery, {
                        name: this.getName(),
                    });
                }
                this.isErrored = false;
                this.errorStreak = 0;
                await sleep(this.config.repeatIntervalInSec * 1000);
            } catch (error) {
                await this.handleError(error);
            }
        }
    }

    stopCron() {
        this.isCronRunning = false;
    }
    startCron() {
        this.isCronRunning = true;
    }
}
