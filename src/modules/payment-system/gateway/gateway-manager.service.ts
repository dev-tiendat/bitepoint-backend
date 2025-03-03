import {
    Injectable,
    NotFoundException,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as Joi from 'joi';
import { ConfigService } from '@nestjs/config';

import { ConfigKeyPaths } from '~/config';

import { ProxyService } from '../proxy/proxy.service';
import { CaptchaSolverService } from '../captcha-solver/captcha-solver.service';
import { GateConfig, GateWayType } from './gateway.interface';
import { Gateway } from './gateway.service';
import { GateFactory } from './gateway-factory/gate.factory';

@Injectable()
export class GatesManagerService implements OnApplicationBootstrap {
    public gates: Gateway[] = [];

    constructor(
        private configService: ConfigService<ConfigKeyPaths>,
        private gateFactory: GateFactory,
        private eventEmitter: EventEmitter2,
        private captchaSolverService: CaptchaSolverService,
        private proxyService: ProxyService
    ) {}

    async onApplicationBootstrap() {
        const banksConfigInput =
            this.configService.get('payment.gateways') || [];

        const banksConfigValidated = this.validateBanksConfig(banksConfigInput);

        this.createGates(banksConfigValidated);
    }

    createGates(banksConfig: GateConfig[]) {
        this.gates = banksConfig.map(bankConfig =>
            this.gateFactory.create(
                bankConfig,
                this.eventEmitter,
                this.captchaSolverService,
                this.proxyService
            )
        );
    }

    validateBanksConfig(banksConfig: GateConfig[]): GateConfig[] {
        const gateConfigSchema = Joi.object({
            name: Joi.string().required(),
            type: Joi.valid(...Object.values(GateWayType)).required(),
            repeatIntervalInSec: Joi.number().min(1).max(120).required(),
            password: Joi.string().when('type', {
                is: [GateWayType.MB_BANK, GateWayType.TP_BANK],
                then: Joi.required(),
            }),
            loginId: Joi.string().when('type', {
                is: [GateWayType.MB_BANK, GateWayType.TP_BANK],
                then: Joi.required(),
            }),
            deviceId: Joi.string().when('type', {
                is: [GateWayType.TP_BANK],
                then: Joi.required(),
            }),
            token: Joi.string(),
            account: Joi.string().required(),
            proxy: Joi.string(),
            getTransactionDayLimit: Joi.number().min(1).max(100).default(14),
            getTransactionCountLimit: Joi.number().min(1).max(100).default(100),
        });

        const banksConfigRes: GateConfig[] = [];
        for (const bankConfig of banksConfig) {
            const { error, value } = gateConfigSchema.validate(bankConfig);

            if (error) {
                throw new Error(
                    `Invalid bank config: ${error.message} ${JSON.stringify(
                        bankConfig
                    )}`
                );
            }
            banksConfigRes.push(value);
        }
        return banksConfigRes;
    }

    stopCron(name: string, timeInSec: number) {
        const gate = this.gates.find(gate => gate.getName() === name);
        if (!gate) throw new NotFoundException({ error: 'Gate not found' });

        gate.stopCron();
        setTimeout(() => {
            gate.startCron();
        }, timeInSec * 1000);
    }
    stopAllCron() {
        this.gates.forEach(gate => gate.stopCron());
        setTimeout(() => {
            this.startAllCron();
        }, 5 * 60000);
    }
    startAllCron() {
        this.gates.forEach(gate => gate.startCron());
    }

    getGateConfigs() {
        return this.gates.map(gate => gate.getConfig());
    }
}
