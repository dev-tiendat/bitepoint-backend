import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import {
    RESPONSE_SUCCESS_CODE,
    RESPONSE_SUCCESS_MSG,
} from '~/constants/response.constant';

export class ResOp<T = any> {
    @ApiProperty({ type: 'object' })
    data?: T;

    @ApiProperty({ type: 'number', default: RESPONSE_SUCCESS_CODE })
    code: number;

    @ApiProperty({ type: 'string', default: RESPONSE_SUCCESS_MSG })
    message: string;

    constructor(code: number, data: T, message = RESPONSE_SUCCESS_MSG) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    static success<T>(data?: T, message?: string) {
        return new ResOp(RESPONSE_SUCCESS_CODE, data, message);
    }

    static error(code: number, message) {
        return new ResOp(code, {}, message);
    }
}

export class TreeResult<T> {
    @ApiProperty()
    id: number;

    @ApiProperty()
    parentId: number;

    @ApiProperty()
    children?: TreeResult<T>[];
}

export class Timestamp {
    @AutoMap()
    @ApiProperty({ description: 'Ngày tạo' })
    createdAt: number;

    @AutoMap()
    @ApiProperty({ description: 'Ngày cập nhật cuối cùng' })
    updatedAt: number;
}
