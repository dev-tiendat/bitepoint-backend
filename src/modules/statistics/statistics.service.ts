import { Injectable } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderStatus } from '../order/order.constant';
import { ReservationInfo, StatisticsDetail, Stats } from './statistics.model';
import { ReservationEntity } from '../reservation/reservation.entity';
import { TableCustomerInfo } from '../order/order.model';
import { convertToUnix } from '~/utils/date.util';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>,
        @InjectRepository(ReservationEntity)
        private reservationRepository: Repository<ReservationEntity>
    ) {}

    async getStatistics() {
        const stats = await this.getStats();
        const popularMenu = await this.getPopularMenu();
        const customersWithReservations =
            await this.getCustomersWithReservations();

        return {
            stats,
            popularMenuItems: popularMenu,
            reservations: customersWithReservations,
        } as StatisticsDetail;
    }

    async getStats() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await this.orderRepository.find({
            where: {
                status: Not(OrderStatus.CANCELLED),
                orderTime: Between(startOfDay, endOfDay),
            },
            cache: true,
        });

        const totalOrdering = orders.filter(
            order => order.status === OrderStatus.ORDERING
        ).length;
        const totalEarning = orders.reduce(
            (acc, order) => acc + order.totalPrice,
            0
        );
        const ordersCompleted = orders.filter(
            order => order.status === OrderStatus.COMPLETED
        ).length;

        return {
            totalOrder: totalOrdering,
            totalEarning,
            ordersCompleted,
        } as Stats;
    }

    async getPopularMenu() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await this.orderRepository.find({
            where: {
                orderTime: Between(startOfDay, endOfDay),
            },
            relations: ['orderItems', 'orderItems.menuItem'],
            cache: true,
        });

        const menuItems = orders
            .flatMap(order => order.orderItems)
            .reduce(
                (acc, orderItem) => {
                    const menuItem = orderItem.menuItem;
                    if (acc[menuItem.id]) {
                        acc[menuItem.id].quantity += orderItem.quantity;
                    } else {
                        acc[menuItem.id] = {
                            id: menuItem.id,
                            name: menuItem.name,
                            image: menuItem.image,
                            quantity: orderItem.quantity,
                        };
                    }
                    return acc;
                },
                {} as Record<
                    number,
                    {
                        id: number;
                        name: string;
                        image: string;
                        quantity: number;
                    }
                >
            );

        return Object.values(menuItems).sort((a, b) => b.quantity - a.quantity);
    }

    async getCustomersWithReservations() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const reservations = await this.reservationRepository.find({
            cache: true,
            where: {
                reservationTime: Between(startOfDay, endOfDay),
            },
        });

        return reservations.map(
            reservation =>
                ({
                    reservationId: reservation.id,
                    customerName: reservation.customerName,
                    guestCount: reservation.guestCount,
                    phone: reservation.phone,
                    reservationTime: convertToUnix(reservation.reservationTime),
                }) as ReservationInfo
        );
    }
}
