import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNil } from 'lodash';

import { TableZoneService } from '../table-zone/table-zone.service';
import { TableTypeService } from '../table-type/table-type.service';
import { TableDto, TableUpdateDto } from './table.dto';
import { TableEntity } from './table.entity';

@Injectable()
export class TableService {
    constructor(
        @InjectRepository(TableEntity)
        private tableRepository: Repository<TableEntity>,
        private tableZoneService: TableZoneService,
        private tableTypeService: TableTypeService
    ) {}

    async listByZoneId(id: number): Promise<TableEntity[]> {
        return this.tableRepository.findBy({ tableZone: { id } });
    }

    async create(tzId: number, dto: TableDto): Promise<void> {
        const tableZone = await this.tableZoneService.findTableZoneById(tzId);
        const tableType = await this.tableTypeService.findTableTypeById(
            dto.tableTypeId
        );

        const data = {
            tableName: dto.tableName,
            tableType: tableType,
            tableZone: tableZone,
        } as TableEntity;

        await this.tableRepository.create(data);
    }

    async update(
        tzId: number,
        tId: number,
        dto: TableUpdateDto
    ): Promise<void> {
        const tableZone = await this.tableZoneService.findTableZoneById(tzId);
        await this.findTableByIdAndZone(tId, tableZone.id);

        const { tableTypeId, ...data } = dto;
        if (!isNil(tableTypeId)) {
            const tableType =
                await this.tableTypeService.findTableTypeById(tableTypeId);
            data['tableType'] = tableType;
        }

        this.tableRepository.update({ id: tId }, data);
    }

    async delete(tzId: number, tId: number): Promise<void> {
        const tableZone = await this.tableZoneService.findTableZoneById(tzId);
        const table = await this.findTableByIdAndZone(tId, tableZone.id);

        await this.tableRepository.remove(table);
    }

    async findAllTableByZoneId(id: number): Promise<TableEntity[]> {
        return this.tableRepository.findBy({ tableZone: { id } });
    }

    async findTableById(id: number): Promise<TableEntity> {
        const table = await this.tableRepository.findOneBy({ id });
        if (isNil(table))
            throw new BadRequestException('Table does not exists');

        return table;
    }

    async findTableByIdAndZone(
        tId: number,
        tzId: number
    ): Promise<TableEntity> {
        const table = await this.tableRepository.findOne({
            where: { id: tId },
            relations: ['tableZone'],
        });
        if (isNil(table)) {
            throw new BadRequestException('Table does not exist');
        }
        if (table.tableZone.id !== tzId) {
            throw new BadRequestException(
                'Table does not belong to Table Zone'
            );
        }
        return table;
    }
}
