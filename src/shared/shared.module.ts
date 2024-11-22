import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
    imports: [
        DatabaseModule,
        HttpModule,
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot([
            {
                limit: 20,
                ttl: 60000,
            },
        ]),
        LoggerModule.forRoot(),
        RedisModule,
    ],
    exports: [HttpModule, RedisModule],
})
export class SharedModule {}
