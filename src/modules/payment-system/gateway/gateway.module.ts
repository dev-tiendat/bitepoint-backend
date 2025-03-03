import { Module } from '@nestjs/common';

import { ProxyModule } from '../proxy/proxy.module';
import { CaptchaSolverModule } from '../captcha-solver/captcha-solver.module';
import { GateFactory } from './gateway-factory/gate.factory';
import { GatewayController } from './gateway.controller';
import { GatesManagerService } from './gateway-manager.service';

const providers = [GatesManagerService, GateFactory];

@Module({
    imports: [CaptchaSolverModule, ProxyModule],
    controllers: [GatewayController],
    providers: [...providers],
    exports: [...providers],
})
export class GatewayModule {}
