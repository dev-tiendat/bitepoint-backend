import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Like, Repository } from 'typeorm';
import { isEmpty, isNil } from 'lodash';

import { FileService } from '~/modules/file/file.service';
import { paginate } from '~/helper/paginate';
import { Pagination } from '~/helper/paginate/pagination';
import {
    TableTypeDto,
    TableTypeQueryDto,
    TableTypeUpdateDto,
} from './table-type.dto';
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
        pageSize,
        name,
    }: TableTypeQueryDto): Promise<Pagination<TableTypeDetail>> {
        const queryBuilder = this.tableTypeRepository
            .createQueryBuilder('table-type')
            .where({
                ...(name ? { name: Like(`%${name}%`) } : null),
            });

        return paginate<TableTypeEntity, TableTypeDetail>(
            queryBuilder,
            { page, pageSize },
            source =>
                this.mapper.mapArray(source, TableTypeEntity, TableTypeDetail)
        );
    }

    async create(dto: TableTypeDto): Promise<void> {
        const path = await this.fileService.saveFile(dto.image);
        await this.tableTypeRepository.save({ name: dto.name, image: path });
    }

    async update(id: number, dto: TableTypeUpdateDto): Promise<void> {
        const tableType = await this.findTableTypeById(id);

        let path = null;
        if (!isEmpty(dto.image))
            path = await this.fileService.saveFile(dto.image);

        tableType.name = dto.name ? dto.name : tableType.name;
        tableType.image = path ? path : tableType.image;
        await tableType.save();
    }

    async delete(id: number): Promise<void> {
        const tableType = await this.findTableTypeById(id);
        await tableType.remove();
    }

    async findTableTypeById(id: number): Promise<TableTypeEntity> {
        const tableType = await this.tableTypeRepository.findOneBy({ id });
        if (isNil(tableType))
            throw new BadRequestException('Table type does not exists');

        return tableType;
    }

    async checkTableByTableTypeId(id: number): Promise<boolean> {
        return !!this.tableTypeRepository.findOne({
            where: {},
        });
    }
}
