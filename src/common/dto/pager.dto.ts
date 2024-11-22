import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
    Allow,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export enum Order {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class PagerDto<T = any> {
    @IsInt()
    @Min(1)
    @Expose()
    @IsOptional({ always: true })
    @Transform(({ value: val }) => (val ? Number.parseInt(val) : 1), {
        toClassOnly: true,
    })
    @ApiProperty({ description: 'Trang số', minimum: 1, default: 1 })
    page?: number;

    @Min(1)
    @Max(100)
    @IsInt()
    @IsOptional({ always: true })
    @Expose()
    @Transform(({ value: val }) => (val ? Number.parseInt(val) : 10), {
        toClassOnly: true,
    })
    @ApiProperty({
        description: 'Số bản ghi trong 1 page',
        minimum: 1,
        maximum: 100,
        default: 10,
    })
    pageSize?: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    field?: keyof T;

    @IsEnum(Order)
    @IsOptional()
    @Transform(({ value }) => (value === 'asc' ? Order.ASC : Order.DESC))
    order?: Order;

    @Allow()
    _t?: number;
}
