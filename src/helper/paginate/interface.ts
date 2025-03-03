import { ObjectLiteral } from 'typeorm';

export enum PaginationType {
    LIMIT_AND_OFFSET = 'limit',
    TAKE_AND_SKIP = 'take_and_skip',
}

export interface IPaginationOptions {
    page: number;
    pageSize: number;
    paginationType?: PaginationType;
}

export interface IPaginationMeta extends ObjectLiteral {
    itemCount: number;
    totalItems?: number;
    itemsPerPage: number;
    totalPages?: number;
    currentPage: number;
}
