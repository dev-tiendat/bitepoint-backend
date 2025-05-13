import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '~/modules/user/user.module';

import { LoginLogEntity } from './entities/login-log.entity';
import { LoginLogService } from './services/login-log.service';

const providers = [LoginLogService];

@Module({
    imports: [TypeOrmModule.forFeature([LoginLogEntity]), UserModule],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class LogModule {}
