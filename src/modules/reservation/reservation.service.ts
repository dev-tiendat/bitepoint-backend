import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { isEmpty } from 'lodash';

import { EventBusEvents } from '~/constants/event-bus.constant';

import { NotificationType } from '../notification/notification.constant';
import { OrderInfo } from '../order/order.model';
import { OrderService } from '../order/order.service';
import { TableStatus } from '../table/table.constant';
import { ReservationDto } from './reservation.dto';
import { ReservationEntity } from './reservation.entity';
import { ReservationStatus } from './reservation.constant';
import { ReservationDetail } from './reservation.model';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(ReservationEntity)
        private readonly reservationRepository: Repository<ReservationEntity>,
        @InjectMapper()
        private mapper: Mapper,
        @InjectEntityManager()
        private entityManager: EntityManager,
        private eventEmitter: EventEmitter2,
        private orderService: OrderService
    ) {}

    async list(): Promise<ReservationDetail[]> {
        const reservations = await this.reservationRepository.find({
            relations: ['orders', 'orders.table'],
        });
        return this.mapper.mapArray(
            reservations,
            ReservationEntity,
            ReservationDetail
        );
    }

    async getOrderInfo(reservationId: number): Promise<OrderInfo[]> {
        const reservation = await this.reservationRepository.findOne({
            where: { id: reservationId },
            relations: ['orders', 'orders.table'],
        });
        const tableIds = reservation.orders.map(order => order.table.id);
        return this.orderService.getTableOrderInfo(tableIds);
    }

    async cancelReservation(reservationId: number) {
        return this.entityManager.transaction(async manager => {
            const reservation = await this.reservationRepository.findOne({
                where: { id: reservationId },
                relations: ['orders', 'orders.table'],
            });

            reservation.status = ReservationStatus.CANCELED;
            await manager.save(reservation);

            this.eventEmitter.emit(EventBusEvents.NotificationSend, {
                type: NotificationType.RESERVATION_CANCELED,
                data: { customerName: reservation.customerName },
            });

            return Promise.all(
                reservation.orders.map(async order => {
                    const table = order.table;
                    if (!isEmpty(table)) {
                        table.status = TableStatus.AVAILABLE;
                        return manager.save(table);
                    }
                })
            );
        });
    }

    async create(dto: ReservationDto) {
        const reservation = await this.reservationRepository.save(dto);
        this.eventEmitter.emit(EventBusEvents.NotificationSend, {
            type: NotificationType.RESERVATION_CREATED,
            data: { customerName: dto.customerName },
        });
    }

    async changeStatus(
        reservationId: number,
        status: ReservationStatus
    ): Promise<ReservationEntity> {
        const reservation = await this.reservationRepository.findOne({
            where: { id: reservationId },
        });

        reservation.status = status;
        await this.reservationRepository.save(reservation);

        return reservation;
    }
}
