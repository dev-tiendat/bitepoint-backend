import { Transform } from 'class-transformer';
import dayjs from 'dayjs';
import { castArray, isArray, isNil, trim } from 'lodash';

export function ToNumber(): PropertyDecorator {
    return Transform(
        params => {
            const value = params.value as string[] | string;

            if (isArray(value)) return value.map(v => Number(v));

            return Number(value);
        },
        { toClassOnly: true }
    );
}

export function ToInt(): PropertyDecorator {
    return Transform(
        params => {
            const value = params.value as string[] | string;

            if (isArray(value)) return value.map(v => Number.parseInt(v));

            return Number.parseInt(value);
        },
        { toClassOnly: true }
    );
}

export function ToBoolean(): PropertyDecorator {
    return Transform(
        params => {
            switch (params.value) {
                case 'true':
                    return true;
                case 'false':
                    return false;
                default:
                    return params.value;
            }
        },
        { toClassOnly: true }
    );
}

export function ToDate(): PropertyDecorator {
    return Transform(
        params => {
            const value = params.value as string | Date;
            if (value instanceof Date) return value;

            if (!value) return;

            if (Number.parseInt(value))
                return dayjs.unix(Number.parseInt(value)).toDate();

            return dayjs(value).add(1, 'day').toDate();
        },
        { toClassOnly: true }
    );
}

export function ToArray(): PropertyDecorator {
    return Transform(
        params => {
            const value = params.value;

            if (isNil(value)) {
                return [];
            }

            return castArray(value);
        },
        { toClassOnly: true }
    );
}

export function ToTrim(): PropertyDecorator {
    return Transform(
        params => {
            const value = params.value as string[] | string;

            if (isArray(value)) return value.map(v => trim(v));

            return trim(value);
        },
        { toClassOnly: true }
    );
}

export function ToLowerCase(): PropertyDecorator {
    return Transform(
        params => {
            const value = params.value as string[] | string;

            if (!value) return;

            if (isArray(value)) return value.map(v => v.toLowerCase());

            return value.toLowerCase();
        },
        { toClassOnly: true }
    );
}

export function ToUpperCase(): PropertyDecorator {
    return Transform(
        params => {
            const value = params.value as string[] | string;

            if (!value) return;

            if (isArray(value)) return value.map(v => v.toUpperCase());

            return value.toUpperCase();
        },
        { toClassOnly: true }
    );
}
