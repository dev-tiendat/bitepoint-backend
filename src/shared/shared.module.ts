import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from './logger/logger.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { isDev } from '~/global/env';
import { MailerModule } from './mailer/mailer.module';

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
        EventEmitterModule.forRoot({
            wildcard: true,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 20,
            verboseMemoryLeak: isDev,
            ignoreErrors: false,
        }),
        LoggerModule.forRoot(),
        RedisModule,
        MailerModule,
    ],
    exports: [HttpModule, RedisModule, MailerModule],
})
export class SharedModule {}
