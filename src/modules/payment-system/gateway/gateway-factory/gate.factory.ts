import { EventEmitter2 } from '@nestjs/event-emitter';

import { CaptchaSolverService } from '../../captcha-solver/captcha-solver.service';
import { ProxyService } from '../../proxy/proxy.service';
import { GateConfig, GateWayType } from '../gateway.interface';
import { Gateway } from '../gateway.service';

import { TPBankService } from './tpbank.service';
import { MBBankService } from './mbbank.service';

export class GateFactory {
    create(
        config: GateConfig,
        eventEmitter: EventEmitter2,
        captchaSolver: CaptchaSolverService,
        proxies: ProxyService
    ): Gateway {
        switch (config.type) {
            case GateWayType.TP_BANK:
                const tpBank = new TPBankService(
                    config,
                    eventEmitter,
                    captchaSolver,
                    proxies
                );
                return tpBank;
            case GateWayType.MB_BANK:
                const mbBank = new MBBankService(
                    config,
                    eventEmitter,
                    captchaSolver,
                    proxies
                );
                return mbBank;

            default:
                throw new Error('Gate not found');
        }
    }
}
