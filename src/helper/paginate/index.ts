import {
    FindManyOptions,
    FindOptionsWhere,
    ObjectLiteral,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { IPaginationOptions, PaginationType } from './interface';
import { Pagination } from './pagination';
import { createPaginationObject } from './create-pagination';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

function resolveOptions(
    options: IPaginationOptions
): [number, number, PaginationType] {
    const { page, pageSize, paginationType } = options;

    return [
        page || DEFAULT_PAGE,
        pageSize || DEFAULT_LIMIT,
        paginationType || PaginationType.TAKE_AND_SKIP,
    ];
}

async function paginateRepository<T, U = T>(
    repository: Repository<T>,
    options: IPaginationOptions,
    mapping?: (source: T[]) => U[],
    searchOptions?: FindManyOptions<T> | FindOptionsWhere<T>
): Promise<Pagination<U>> {
    const [page, limit] = resolveOptions(options);

    const promises: [Promise<T[]>, Promise<number> | undefined] = [
        repository.find({
            skip: limit * (page - 1),
            take: limit,
            ...searchOptions,
        }),
        repository.count(searchOptions),
    ];

    const [entities, total] = await Promise.all(promises);
    const items: U[] = mapping?.(entities) || (entities as unknown as U[]);

    return createPaginationObject<U>({
        items,
        limit,
        currentPage: page,
        totalItems: total,
    });
}

async function paginateQueryBuilder<T, U>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions,
    mapping?: (source: T[]) => U[]
): Promise<Pagination<U>> {
    const [page, limit, paginationType] = resolveOptions(options);

    if (paginationType === PaginationType.TAKE_AND_SKIP)
        queryBuilder.take(limit).skip((page - 1) * limit);
    else queryBuilder.limit(limit).offset((page - 1) * limit);

    const [entities, total] = await queryBuilder.getManyAndCount();
    
    const items = mapping?.(entities) || (entities as unknown as U[]);

    return createPaginationObject({
        items,
        limit,
        currentPage: page,
        totalItems: total,
    });
}

export async function paginateRaw<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions
): Promise<Pagination<T>> {
    const [page, limit, paginationType] = resolveOptions(options);

    const promises: [Promise<T[]>, Promise<number> | undefined] = [
        (paginationType === PaginationType.LIMIT_AND_OFFSET
            ? queryBuilder.limit(limit).offset((page - 1) * limit)
            : queryBuilder.take(limit).skip((page - 1) * limit)
        ).getRawMany<T>(),
        queryBuilder.getCount(),
    ];

    const [items, total] = await Promise.all(promises);

    return createPaginationObject<T>({
        items,
        totalItems: total,
        currentPage: page,
        limit,
    });
}

export async function paginateRawAndEntities<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions
): Promise<[Pagination<T>, Partial<T>[]]> {
    const [page, limit, paginationType] = resolveOptions(options);

    const promises: [
        Promise<{ entities: T[]; raw: T[] }>,
        Promise<number> | undefined,
    ] = [
        (paginationType === PaginationType.LIMIT_AND_OFFSET
            ? queryBuilder.limit(limit).offset((page - 1) * limit)
            : queryBuilder.take(limit).skip((page - 1) * limit)
        ).getRawAndEntities<T>(),
        queryBuilder.getCount(),
    ];

    const [itemObject, total] = await Promise.all(promises);

    return [
        createPaginationObject<T>({
            items: itemObject.entities,
            totalItems: total,
            currentPage: page,
            limit,
        }),
        itemObject.raw,
    ];
}

export async function paginate<T extends ObjectLiteral, U = T>(
    repository: Repository<T>,
    options: IPaginationOptions,
    mapping?: (source: T[]) => U[],
    searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>
): Promise<Pagination<U>>;

export async function paginate<T extends ObjectLiteral, U = T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions,
    mapping?: (source: T[]) => U[]
): Promise<Pagination<U>>;

export async function paginate<T extends ObjectLiteral, U = T>(
    repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
    options: IPaginationOptions,
    mapping?: (source: T[]) => U[],
    searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>
): Promise<Pagination<U>> {
    return repositoryOrQueryBuilder instanceof Repository
        ? paginateRepository<T, U>(
              repositoryOrQueryBuilder,
              options,
              mapping,
              searchOptions
          )
        : paginateQueryBuilder<T, U>(
              repositoryOrQueryBuilder,
              options,
              mapping
          );
}
