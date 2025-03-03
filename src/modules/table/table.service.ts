import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WsException } from '@nestjs/websockets';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { EntityManager, In, Repository } from 'typeorm';
import { isNil } from 'lodash';

import { EventBusEvents } from '~/constants/event-bus.constant';
import { WsBusinessException } from '~/common/exceptions/ws-biz.exception';
import { NotificationType } from '../notification/notification.constant';
import { OrderStatus } from '../order/order.constant';
import { TableZoneService } from '../table-zone/table-zone.service';
import { TableTypeService } from '../table-type/table-type.service';
import { TableDto, TableQueryDto, TableUpdateDto } from './table.dto';
import { TableEntity } from './table.entity';
import { TableStatus } from './table.constant';
import { TableDetail } from './table.model';

@Injectable()
export class TableService {
    constructor(
        @InjectRepository(TableEntity)
        private tableRepository: Repository<TableEntity>,
        @InjectEntityManager()
        private entityManager: EntityManager,
        @InjectMapper()
        private mapper: Mapper,
        private tableZoneService: TableZoneService,
        private tableTypeService: TableTypeService,
        private eventEmitter: EventEmitter2
    ) {}

    async list(id: number, { status }: TableQueryDto): Promise<TableDetail[]> {
        const tables = await this.tableRepository.find({
            where: { tableZone: { id }, status },
            relations: ['tableType', 'tableZone'],
        });

        return this.mapper.mapArray(tables, TableEntity, TableDetail);
    }

    async detail(id: number): Promise<TableDetail> {
        const table = await this.tableRepository.findOne({
            where: { id },
            relations: ['tableType'],
        });
        if (isNil(table)) {
            throw new NotFoundException('Table not found');
        }

        return this.mapper.map(table, TableEntity, TableDetail);
    }

    async reserveTables(ids: number[]): Promise<TableEntity[]> {
        return this.entityManager.transaction(async manager => {
            const tables = await this.findByIds(ids);
            if (tables.length === 0) {
                throw new WsException('Tables not found');
            }

            return await Promise.all(
                tables.map(async table => {
                    if (table.status !== TableStatus.AVAILABLE)
                        throw new WsException('Table is not available');

                    table.status = TableStatus.OCCUPIED;

                    return manager.save(table);
                })
            );
        });
    }

    async cleanTable(id: number): Promise<TableEntity> {
        const table = await this.tableRepository.findOneBy({ id });
        if (isNil(table)) {
            throw new WsBusinessException('Table not found');
        }

        table.status = TableStatus.AVAILABLE;
        await this.tableRepository.save(table);

        this.eventEmitter.emit(EventBusEvents.NotificationSend, {
            type: NotificationType.TABLE_CLEANED,
            data: { tableName: table.name },
        });
        return table;
    }

    async create(tzId: number, dto: TableDto): Promise<void> {
        const tableZone = await this.tableZoneService.findTableZoneById(tzId);
        const tableType = await this.tableTypeService.findOneById(
            dto.tableTypeId
        );

        const data = {
            name: dto.name,
            tableType: tableType,
            tableZone: tableZone,
            show: dto.show,
        } as TableEntity;

        await this.tableRepository.save(data);
    }

    async markTableAsCleaning(tId: number): Promise<void> {
        const table = await this.tableRepository.findOneBy({ id: tId });
        table.status = TableStatus.CLEANING;
        await this.tableRepository.save(table);
    }

    async update(
        tzId: number,
        tId: number,
        dto: TableUpdateDto
    ): Promise<void> {
        const tableZone = await this.tableZoneService.findTableZoneById(tzId);
        await this.findByTableIdAndZoneId(tId, tableZone.id);

        const { tableTypeId, ...data } = dto;
        if (!isNil(tableTypeId)) {
            const tableType =
                await this.tableTypeService.findOneById(tableTypeId);
            data['tableType'] = tableType;
        }

        this.tableRepository.update({ id: tId }, data);
    }

    async delete(tzId: number, tId: number): Promise<void> {
        const tableZone = await this.tableZoneService.findTableZoneById(tzId);
        const table = await this.findByTableIdAndZoneId(tId, tableZone.id);

        await this.tableRepository.remove(table);
    }

    async findAllTableByZoneId(id: number): Promise<TableEntity[]> {
        return this.tableRepository.findBy({ tableZone: { id } });
    }

    async checkIn(tableIds: number[]) {
        const tables = await this.tableRepository.find({
            where: {
                id: In(tableIds),
                show: 1,
                orders: {
                    status: OrderStatus.ORDERING,
                },
            },
            relations: ['orders'],
        });

        return this.entityManager.transaction(async manager => {
            const updatedTables = await Promise.all(
                tables.map(async table => {
                    table.status = TableStatus.OCCUPIED;

                    const currentOrder = table.orders[0];
                    if (isNil(currentOrder.orderTime))
                        currentOrder.orderTime = new Date();
                    await manager.save(currentOrder);
                    return manager.save(table);
                })
            );
            this.eventEmitter.emit(EventBusEvents.NotificationSend, {
                type: NotificationType.ORDER_CHECK_IN,
                data: { tables: updatedTables },
            });
            return updatedTables;
        });
    }

    async findOneById(id: number): Promise<TableEntity> {
        const table = await this.tableRepository.findOneBy({ id });
        if (isNil(table)) throw new NotFoundException('Table not found');

        return table;
    }

    async findByIds(ids: number[]): Promise<TableEntity[]> {
        return this.tableRepository.findBy({ id: In(ids), show: 1 });
    }

    async findOptimalTables(guestCount: number): Promise<TableEntity[]> {
        const availableTables = await this.tableRepository.find({
            where: {
                status: TableStatus.AVAILABLE,
                show: 1,
            },
            relations: ['tableType'],
        });

        if (availableTables.length === 0) {
            throw new WsBusinessException('No available tables');
        }

        const singleTable = availableTables.find(table => {
            return table.tableType.maxCapacity >= guestCount;
        });
        if (singleTable) {
            return [singleTable];
        }

        let remainingGuests = guestCount;
        let selectedTables: TableEntity[] = [];

        for (let i = 0; i < availableTables.length - 1; i++) {
            if (remainingGuests <= 0) break;

            selectedTables.push(availableTables[i]);
            remainingGuests -= availableTables[i].tableType.maxCapacity;

            if (availableTables[i + 1].id === availableTables[i].id + 1) {
                continue;
            }

            if (remainingGuests > 0) {
                remainingGuests = guestCount;
                selectedTables = [];
            }
        }

        if (remainingGuests > 0) {
            selectedTables = [];
            remainingGuests = guestCount;

            for (const table of availableTables) {
                if (remainingGuests <= 0) break;

                selectedTables.push(table);
                remainingGuests -= table.tableType.maxCapacity;
            }
        }

        if (remainingGuests > 0) {
            throw new BadRequestException(
                'No suitable tables available for this guest count'
            );
        }

        return selectedTables;
    }

    async findByTableIdAndZoneId(
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
