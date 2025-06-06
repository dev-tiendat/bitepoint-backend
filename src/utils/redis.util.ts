import type { RedisKeys } from '~/constants/cache.constant'

type Prefix = 'bitepoint'
const prefix = 'bitepoint'

export function getRedisKey<T extends string = RedisKeys | '*'>(key: T, ...concatKeys: string[]): `${Prefix}:${T}${string | ''}` {
  return `${prefix}:${key}${
    concatKeys && concatKeys.length ? `:${concatKeys.join('_')}` : ''
  }`
}
