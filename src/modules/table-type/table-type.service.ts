import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Like, Repository } from 'typeorm';
import { isEmpty, isNil } from 'lodash';

import { FileService } from '~/modules/file/file.service';
import { Order, PagerDto } from '~/common/dto/pager.dto';
import { paginate } from '~/helper/paginate';
import { Pagination } from '~/helper/paginate/pagination'
;
import { TableTypeDto, TableTypeUpdateDto } from './table-type.dto';
import { TableTypeEntity } from './table-type.entity';
import { TableTypeDetail } from './table-type.model';

@Injectable()
export class TableTypeService {
    constructor(
        @InjectRepository(TableTypeEntity)
        private tableTypeRepository: Repository<TableTypeEntity>,
        @InjectMapper()
        private mapper: Mapper,
        private fileService: FileService
    ) {}

    async list({
        page,
        limit: pageSize,
        query,
        field = 'id',
        order = Order.DESC,
    }: PagerDto): Promise<Pagination<TableTypeDetail>> {
        const queryBuilder = this.tableTypeRepository
            .createQueryBuilder('table-type')
            .where({
                ...(query ? { name: Like(`%${query}%`) } : null),
            })
            .orderBy(`table-type.${field}`, order);

        return paginate<TableTypeEntity, TableTypeDetail>(
            queryBuilder,
            { page, pageSize },
            source =>
                this.mapper.mapArray(source, TableTypeEntity, TableTypeDetail)
        );
    }

    async info(id: number): Promise<TableTypeDetail> {
        const tableType = await this.findOneById(id);
        return this.mapper.map(tableType, TableTypeEntity, TableTypeDetail);
    }

    async create(dto: TableTypeDto): Promise<void> {
        const path = await this.fileService.saveFile(dto.image);
        await this.tableTypeRepository.save({ name: dto.name, image: path });
    }

    async update(
        id: number,
        dto: TableTypeUpdateDto
    ): Promise<TableTypeDetail> {
        const tableType = await this.findOneById(id);

        let path = null;
        if (!isEmpty(dto.image))
            path = await this.fileService.saveFile(dto.image);

        tableType.name = dto.name ? dto.name : tableType.name;
        tableType.image = path ? path : tableType.image;
        tableType.maxCapacity = dto.maxCapacity
            ? dto.maxCapacity
            : tableType.maxCapacity;

        const result = await tableType.save();

        return this.mapper.map(result, TableTypeEntity, TableTypeDetail);
    }

    async delete(id: number): Promise<void> {
        const tableType = await this.findOneById(id);
        await tableType.remove();
    }

    async findOneById(id: number): Promise<TableTypeEntity> {
        const tableType = await this.tableTypeRepository.findOneBy({ id });
        if (isNil(tableType))
            throw new NotFoundException('Table type not found');

        return tableType;
    }
}
