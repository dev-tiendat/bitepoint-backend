import { Module, Provider } from '@nestjs/common';
import {
    RedisModule as NestRedisModule,
    RedisService,
} from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, IRedisConfig } from '~/config';
import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator';

const providers: Provider[] = [
    {
        provide: REDIS_CLIENT,
        useFactory: (redisService: RedisService) => redisService.getOrThrow(),
        inject: [RedisService],
    },
];

@Module({
    imports: [
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
    exports: [...providers],
})
export class RedisModule {}
