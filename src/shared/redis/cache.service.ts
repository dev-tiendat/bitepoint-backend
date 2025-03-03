import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { Cache } from 'cache-manager';
import { Emitter } from '@socket.io/redis-emitter';
import { API_CACHE_PREFIX } from '~/constants/cache.constant';
import { getRedisKey } from '~/utils/redis.util';
import { RedisIoAdapterKey } from '~/common/adapters/socket.adapter';

export type CacheKey = string;
export type CacheResult<T> = Promise<T | undefined>;

export class CacheService {
    private cache!: Cache;
    private ioRedis!: Redis;

    constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
        this.cache = cacheManager;
    }

    private get redisClient(): Redis {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        return this.cache.store.client;
    }

    public get<T>(key: CacheKey): CacheResult<T> {
        return this.cache.get(key);
    }

    public async set<T>(
        key: CacheKey,
        value: any,
        milliseconds: number
    ): Promise<void> {
        await this.cache.set(key, value, milliseconds);
    }

    public getClient() {
        return this.redisClient;
    }

    private _emitter: Emitter;

    public get emitter(): Emitter {
        if (this._emitter) return this._emitter;

        this._emitter = new Emitter(this.redisClient, {
            key: RedisIoAdapterKey,
        });

        return this._emitter;
    }

    public async cleanCatch() {
        const redis = this.getClient();
        const keys: string[] = await redis.keys(`${API_CACHE_PREFIX}*`);
        await Promise.all(keys.map(key => redis.del(key)));
    }

    public async cleanAllRedisKey() {
        const redis = this.getClient();
        const keys: string[] = await redis.keys(getRedisKey('*'));

        await Promise.all(keys.map(key => redis.del(key)));
    }
}
