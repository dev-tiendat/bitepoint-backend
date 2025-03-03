import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { PagerDto } from '~/common/dto/pager.dto';
import { Pagination } from '~/helper/paginate/pagination';
import { paginate } from '~/helper/paginate';

import { ParamConfigEntity } from './param-config.entity';
import { ParamConfigDto } from './param-config.dto';
import { ParamConfigInfo } from './param-config.model';

@Injectable()
export class ParamConfigService {
    constructor(
        @InjectRepository(ParamConfigEntity)
        private paramConfigRepository: Repository<ParamConfigEntity>,
        @InjectMapper()
        private mapper: Mapper
    ) {}

    async list({
        page,
        limit: pageSize,
        query,
    }: PagerDto): Promise<Pagination<ParamConfigInfo>> {
        const queryBuilder =
            this.paramConfigRepository.createQueryBuilder('config');

        queryBuilder.where('config.name LIKE :name', {
            name: `%${query}%`,
        });

        return paginate<ParamConfigEntity, ParamConfigInfo>(
            queryBuilder,
            { page, pageSize },
            source =>
                this.mapper.mapArray(source, ParamConfigEntity, ParamConfigInfo)
        );
    }

    async countConfigList(): Promise<number> {
        return this.paramConfigRepository.count();
    }

    async create(dto: ParamConfigDto): Promise<void> {
        await this.paramConfigRepository.insert(dto);
    }

    async update(id: number, dto: ParamConfigDto): Promise<void> {
        await this.findOneById(id);
        await this.paramConfigRepository.update(id, dto);
    }

    async delete(id: number): Promise<void> {
        await this.findOneById(id);
        await this.paramConfigRepository.delete(id);
    }

    async findOneById(id: number): Promise<ParamConfigEntity> {
        const paramConfig = await this.paramConfigRepository.findOneBy({ id });
        if (!paramConfig) {
            throw new NotFoundException('Param config not found');
        }
        return paramConfig;
    }

    async findValueByKey(key: string): Promise<string | null> {
        const result = await this.paramConfigRepository.findOne({
            where: { key },
            select: ['value'],
        });
        if (result) return result.value;

        return null;
    }
}
