import { customAlphabet, nanoid } from 'nanoid';

import { md5 } from './crypto.util';

export function generateUUID(size: number = 21): string {
    return nanoid(size);
}

export function generateShortUUID(): string {
    return nanoid(10);
}

export function generateRandomValue(
    length: number,
    placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
): string {
    const customNanoid = customAlphabet(placeholder, length);
    return customNanoid();
}

export function randomValue(
    size = 16,
    dict = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
): string {
    let id = '';
    let i = size;
    const len = dict.length;
    while (i--) id += dict[(Math.random() * len) | 0];
    return id;
}

export const hashString = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
        Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
        Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const uniqueSlash = (path: string) =>
    path.replace(/(https?:\/)|(\/)+/g, '$1$2');
