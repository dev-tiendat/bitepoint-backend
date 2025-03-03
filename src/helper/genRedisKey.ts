import { RedisKeys } from '~/constants/cache.constant';

export function genAuthTokenKey(value: string | number) {
    return `${RedisKeys.AUTH_TOKEN_PREFIX}${String(value)}` as const;
}

export function genAuthPasswordVersionKey(value: string | number) {
    return `${RedisKeys.AUTH_PASSWORD_VERSION_PREFIX}${String(value)}`;
}

export function genAuthPermKey(value: string | number) {
    return `${RedisKeys.AUTH_PERMISSION_KEY_PREFIX}${String(value)}`;
}

export function genTokenBlacklistKey(tokenId: string) {
    return `${RedisKeys.TOKEN_BLACKLIST_PREFIX}${String(tokenId)}}` as const;
}

export function genTokenPersistentKey(tokenId: string) {
    return `${RedisKeys.TOKEN_PERSISTENT_PREFIX}${String(tokenId)}`;
}
