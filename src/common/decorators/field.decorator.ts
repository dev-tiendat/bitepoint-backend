import {
    IsArray,
    IsBoolean,
    IsDate,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Matches,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import {
    ToArray,
    ToBoolean,
    ToDate,
    ToLowerCase,
    ToNumber,
    ToTrim,
    ToUpperCase,
} from './transform.decorator';
import { isNumber } from 'lodash';
import { applyDecorators } from '@nestjs/common';
import { AutoMap } from '@automapper/classes';

interface IOptionalOptions {
    required?: boolean;
}

interface INumberFieldOptions extends IOptionalOptions {
    each?: boolean;
    int?: boolean;
    min?: number;
    max?: number;
    in?: number[];
    positive?: boolean;
}

interface IStringFieldOptions extends IOptionalOptions {
    each?: boolean;
    minLength?: number;
    maxLength?: number;
    lowerCase?: boolean;
    upperCase?: boolean;
    match?: RegExp;
}

interface IArrayFieldOptions extends IOptionalOptions {
    type?: 'number' | 'string' | 'boolean' | 'date' | 'object';
}

export function NumberField(
    options: INumberFieldOptions = {}
): PropertyDecorator {
    const {
        each,
        min,
        max,
        int,
        positive,
        in: inValues,
        required = true,
    } = options;

    const decorators = [AutoMap(), ToNumber()];

    if (each) decorators.push(ToArray());

    if (int) decorators.push(IsInt({ each }));
    else decorators.push(IsNumber({}, { each }));

    if (isNumber(min)) decorators.push(Min(min, { each }));

    if (isNumber(max)) decorators.push(Max(max, { each }));

    if (inValues) decorators.push(IsIn(inValues, { each }));

    if (positive) decorators.push(IsPositive({ each }));

    if (!required) decorators.push(IsOptional());

    return applyDecorators(...decorators);
}

export function StringField(
    options: IStringFieldOptions = {}
): PropertyDecorator {
    const {
        each,
        minLength,
        maxLength,
        lowerCase,
        upperCase,
        required = true,
        match,
    } = options;

    const decorators = [AutoMap(), IsString({ each }), ToTrim()];

    if (each) decorators.push(ToArray());

    if (isNumber(minLength)) decorators.push(MinLength(minLength, { each }));

    if (isNumber(maxLength)) decorators.push(MaxLength(maxLength, { each }));

    if (lowerCase) decorators.push(ToLowerCase());

    if (upperCase) decorators.push(ToUpperCase());

    if (match) decorators.push(Matches(match, { each }));

    if (!required) decorators.push(IsOptional());
    else decorators.push(IsNotEmpty({ each }));

    return applyDecorators(...decorators);
}

export function BooleanField(options: IOptionalOptions): PropertyDecorator {
    const { required } = options;

    const decorators = [AutoMap(), ToBoolean(), IsBoolean()];

    if (!required) decorators.push(IsOptional());

    return applyDecorators(...decorators);
}

export function DateField(options: IOptionalOptions = {}): PropertyDecorator {
    const decorators = [AutoMap(), ToDate(), IsDate()];

    const { required = true } = options;

    if (!required) decorators.push(IsOptional());

    return applyDecorators(...decorators);
}

export function ArrayField(
    options: IArrayFieldOptions = {}
): PropertyDecorator {
    const decorators = [AutoMap(), ToArray(), IsArray];

    const { type = '', required = true } = options;

    if (!required) decorators.push(IsOptional());

    switch (type) {
        case 'number':
            decorators.push(IsNumber({}, { each: true }));
            break;
        case 'string':
            decorators.push(IsString({ each: true }));
            break;
        case 'boolean':
            decorators.push(IsBoolean({ each: true }));
            break;
        case 'date':
            decorators.push(IsDate({ each: true }));
            break;
        case 'object':
            decorators.push(IsNotEmpty({ each: true }));
            break;
    }

    return applyDecorators(...decorators);
}

export function PhoneField(options: IOptionalOptions = {}): PropertyDecorator {
    const decorators = [AutoMap(), IsString(), ToTrim()];

    const { required = true } = options;

    if (!required) decorators.push(IsOptional());

    decorators.push(Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/));

    return applyDecorators(...decorators);
}
