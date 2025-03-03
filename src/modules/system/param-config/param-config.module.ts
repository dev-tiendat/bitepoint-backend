import { Module, Param } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParamConfigService } from './param-config.service';
import { ParamConfigProfile } from './param-config.profile';
import { ParamConfigEntity } from './param-config.entity';
import { ParamConfigController } from './param-config.controler';

const providers = [ParamConfigService, ParamConfigProfile];

@Module({
    imports: [TypeOrmModule.forFeature([ParamConfigEntity])],
    controllers: [ParamConfigController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class ParamConfigModule {}
