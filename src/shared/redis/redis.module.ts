import { Module, Provider } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import {
    RedisModule as NestRedisModule,
    RedisService,
} from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ConfigKeyPaths, IRedisConfig } from '~/config';
import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator';
import { CacheService } from './cache.service';
import { REDIS_PUBSUB } from './redis.constant';
import { RedisSubPub } from './redis-subpub';
import { RedisPubSubService } from './subpub.service';

const providers: Provider[] = [
    CacheService,
    RedisPubSubService,
    {
        provide: REDIS_PUBSUB,
        useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
            const redisOptions: RedisOptions =
                configService.get<IRedisConfig>('redis');
            return new RedisSubPub(redisOptions);
        },
        inject: [ConfigService],
    },
    {
        provide: REDIS_CLIENT,
        useFactory: (redisService: RedisService) => redisService.getOrThrow(),
        inject: [RedisService],
    },
];

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
                const redisOptions: RedisOptions =
                    configService.get<IRedisConfig>('redis');

                return {
                    isGlobal: true,
                    store: redisStore as any,
                    isCacheableValue: () => true,
                    ...redisOptions,
                };
            },
            inject: [ConfigService],
        }),
        NestRedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService<ConfigKeyPaths>) => ({
                readyLog: true,
                config: configService.get<IRedisConfig>('redis'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [...providers],
    exports: [...providers, CacheModule],
})
export class RedisModule {}
