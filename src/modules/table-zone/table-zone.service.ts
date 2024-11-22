import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNil } from 'lodash';

import { TableZoneEntity } from './table-zone.entity';
import { TableZoneDto } from './table-zone.dto';

@Injectable()
export class TableZoneService {
    constructor(
        @InjectRepository(TableZoneEntity)
        private tableZoneRepository: Repository<TableZoneEntity>
    ) {}

    async list(): Promise<TableZoneEntity[]> {
        return this.tableZoneRepository.find();
    }

    async create(dto: TableZoneDto): Promise<void> {
        await this.tableZoneRepository.save(dto);
    }

    async delete(tzId: number): Promise<void> {
        const tableZone = await this.findTableZoneById(tzId);
        await tableZone.remove();
    }

    async findTableZoneById(tzId: number): Promise<TableZoneEntity> {
        const tableZone = await this.tableZoneRepository.findOneBy({
            id: tzId,
        });
        if (isNil(tableZone))
            throw new BadRequestException(`Table zone does not exist`);

        return tableZone;
    }
}
