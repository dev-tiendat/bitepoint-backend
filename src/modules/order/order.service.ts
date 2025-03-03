import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, In, Not, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { isNil } from 'lodash';
import QRcode from 'qrcode';

import { AppConfig, IAppConfig } from '~/config';

import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';
import { MenuItemService } from '../menu-item/menu-item.service';
import { ReservationEntity } from '../reservation/reservation.entity';
import { TableEntity } from '../table/table.entity';
import { OrderCategory } from '../category/category.model';

import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemStatus, OrderStatus } from './order.constant';
import {
    OrderSummary,
    OrderInfo,
    OrderItemDetail,
    OrderItemInfo,
    TableCustomerInfo,
    OrderDetail,
} from './order.model';
import { OrderMenuItemDto as OrderItemDto } from './order.dto';
import { OrderGroupEntity } from './entities/order-group.entity';
import { FindOptimalTableDto } from '../table/table.dto';
import { FeedbackService } from '../feedback/feedback.service';
import { FeedbackDto } from '../feedback/feedback.dto';
import { VoucherEntity } from '../voucher/voucher.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventBusEvents } from '~/constants/event-bus.constant';
import { NotificationType } from '../notification/notification.constant';

@Injectable()
export class OrderService {
    constructor(
        @Inject(AppConfig.KEY)
        private appConfig: IAppConfig,
        @InjectEntityManager()
        private entityManager: EntityManager,
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderItemEntity)
        private orderItemRepository: Repository<OrderItemEntity>,
        @InjectMapper()
        private mapper: Mapper,
        private userService: UserService,
        private categoryService: CategoryService,
        private menuItemService: MenuItemService,
        private feedbackService: FeedbackService,
        private eventEmitter: EventEmitter2
    ) {}

    async getOrderDetail(id: string): Promise<OrderDetail> {
        const order = await this.orderRepository.findOne({
            where: {
                id,
                orderItems: { status: Not(OrderItemStatus.CANCELLED) },
            },
            relations: [
                'table',
                'table.tableType',
                'reservation',
                'orderGroup',
                'orderItems',
                'orderItems.menuItem',
                'voucher',
            ],
        });

        if (!order) throw new NotFoundException('Order not found');

        return this.mapper.map(order, OrderEntity, OrderDetail);
    }

    async getOrderMenuList(): Promise<OrderCategory[]> {
        return this.categoryService.infoList();
    }

    async getTableCustomerInfo(tableId: number): Promise<TableCustomerInfo[]> {
        const currentOrder = await this.orderRepository.findOne({
            where: { table: { id: tableId }, status: OrderStatus.ORDERING },
            relations: ['reservation', 'orderGroup', 'table'],
        });

        const orders = await this.orderRepository.find({
            where: {
                orderGroup: { id: currentOrder.orderGroup?.id },
                reservation: { id: currentOrder.reservation?.id },
                status: OrderStatus.ORDERING,
            },
            relations: ['reservation', 'orderGroup', 'table'],
        });

        return this.mapper.mapArray(orders, OrderEntity, TableCustomerInfo);
    }

    async getOrderHistory(customerId: number): Promise<OrderSummary[]> {
        const orders = await this.orderRepository.find({
            where: { customer: { id: customerId } },
            relations: ['table', 'table.tableType', 'reservation'],
        });

        return this.mapper.mapArray(orders, OrderEntity, OrderSummary);
    }

    async linkCustomerToOrder(orderId: string, customerId: number): Promise<void> {
        const order = await this.findOneById(orderId);
        const customer = await this.userService.findOneById(customerId);

        order.customer = customer;
        await this.orderRepository.save(order);
    }

    async applyVoucherToOrder(orderId: string, voucher: VoucherEntity): Promise<void> {
        const order = await this.findOneById(orderId);
        order.voucher = voucher;
        if (order.payment) {
            order.payment.paidAmount = Math.max(
                0,
                order.totalPrice - voucher.discount
            );
        }

        await this.orderRepository.save(order);
    }

    async urgeOrderItem(orderItemId: number): Promise<OrderItemDetail> {
        const orderItem = await this.orderItemRepository.findOne({
            where: { id: orderItemId },
            relations: ['menuItem', 'order', 'order.table'],
        });

        orderItem.urged = 1;
        await this.orderItemRepository.save(orderItem);
        this.eventEmitter.emit(EventBusEvents.NotificationSend, {
            type: NotificationType.ORDER_URGE,
            data: {
                itemName: orderItem.menuItem.name,
                tableName: orderItem.order.table.name,
            },
        });
        return this.mapper.map(orderItem, OrderItemEntity, OrderItemDetail);
    }

    async cancelOrderItem(orderItemId: number): Promise<OrderItemDetail> {
        const orderItem = await this.orderItemRepository.findOne({
            where: { id: orderItemId },
            relations: ['menuItem', 'order', 'order.table'],
        });

        orderItem.status = OrderItemStatus.CANCELLED;
        await this.orderItemRepository.save(orderItem);

        const order = await this.findOneById(orderItem.order.id);
        order.totalPrice -= orderItem.price * orderItem.quantity;
        if (order.payment) {
            order.payment.paidAmount = order.totalPrice;
        }

        await this.orderRepository.save(order);

        return this.mapper.map(orderItem, OrderItemEntity, OrderItemDetail);
    }

    async listOrders(): Promise<OrderSummary[]> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await this.orderRepository.find({
            where: {
                orderTime: Between(startOfDay, endOfDay),
            },
            order: { status: 'DESC' },
            relations: ['table', 'table.tableType', 'reservation'],
        });

        return this.mapper.mapArray(orders, OrderEntity, OrderSummary);
    }

    async listOrderItems(): Promise<OrderItemDetail[]> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orderItems = await this.orderItemRepository.find({
            where: {
                order: { orderTime: Between(startOfDay, endOfDay) },
            },
            relations: [
                'menuItem',
                'menuItem.historyPrices',
                'order',
                'order.table',
            ],
        });

        return this.mapper.mapArray(orderItems, OrderItemEntity, OrderItemDetail);
    }

    async listMenuItemsByOrderId(orderId: string): Promise<OrderItemInfo[]> {
        const orderItems = await this.orderItemRepository.find({
            where: { order: { id: orderId } },
        });

        return this.mapper.mapArray(orderItems, OrderItemEntity, OrderItemInfo);
    }

    async markOrderAsCompleted(orderId: string): Promise<void> {
        const order = await this.findOneById(orderId);
        order.status = OrderStatus.COMPLETED;
        await this.orderRepository.save(order);
    }

    async createOrderItems(orderId: string, items: OrderItemDto[]): Promise<OrderItemDetail[]> {
        const result = await this.entityManager.transaction(async manager => {
            const order = await this.findOneById(orderId);

            const orderedItems = await Promise.all(
                items.map(async item => {
                    const { id, ...rest } = item;
                    const menuItem = await this.menuItemService.findOneById(item.id);
                    const price = await this.menuItemService.findCurrentPriceById(item.id);

                    order.totalPrice += price.price * item.quantity;
                    await manager.save(order);

                    const orderItem = this.orderItemRepository.create({
                        menuItem,
                        price: price.price,
                        order,
                        status: OrderItemStatus.ORDERED,
                        ...rest,
                    });

                    return await manager.save(orderItem);
                })
            );

            return orderedItems;
        });

        return this.mapper.mapArray(result, OrderItemEntity, OrderItemDetail);
    }

    async advanceOrderItemStatus(orderItemId: number): Promise<OrderItemDetail> {
        const orderItem = await this.orderItemRepository.findOne({
            where: { id: orderItemId },
            relations: ['menuItem', 'order', 'order.table'],
        });

        const statusMap = {
            [OrderItemStatus.ORDERED]: OrderItemStatus.PREPARING,
            [OrderItemStatus.PREPARING]: OrderItemStatus.READY,
            [OrderItemStatus.READY]: OrderItemStatus.SERVED,
        };

        const nextStatus = statusMap[orderItem.status];

        orderItem.status = nextStatus;
        await this.orderItemRepository.save(orderItem);

        return this.mapper.map(orderItem, OrderItemEntity, OrderItemDetail);
    }

    async createOrders(
        tables: TableEntity[],
        reservation?: ReservationEntity,
        info?: FindOptimalTableDto,
        orderTime?: Date
    ): Promise<OrderInfo[]> {
        let orderGroup = null;
        if (isNil(reservation)) {
            orderGroup = await this.entityManager.save(OrderGroupEntity, {
                ...info,
            });
        }

        return Promise.all(
            tables.map(async table => {
                const order = await this.entityManager.save(OrderEntity, {
                    table,
                    reservation,
                    orderGroup,
                    status: OrderStatus.ORDERING,
                    orderTime: orderTime,
                    totalPrice: 0,
                });

                const qrcode = await this.generateQRCode(order.id);

                return {
                    orderId: order.id,
                    tableName: table.name,
                    qrcode,
                    orderTime,
                };
            })
        );
    }

    async findOrderItemsByOrderId(orderId: string): Promise<OrderItemInfo[]> {
        const orderItems = await this.orderItemRepository.find({
            where: { order: { id: orderId } },
            relations: ['menuItem', 'menuItem.historyPrices'],
            order: { id: 'DESC' },
        });

        return this.mapper.mapArray(orderItems, OrderItemEntity, OrderItemInfo);
    }

    async updateOrderCheckInStatus(orderId: string, status: OrderStatus): Promise<void> {
        const order = await this.findOneById(orderId);
        order.orderTime = new Date();
        order.status = status;

        await this.orderRepository.save(order);
    }

    async findOneById(orderId: string): Promise<OrderEntity> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['table', 'feedback', 'payment', 'voucher'],
        });
        if (!order) throw new NotFoundException('Order not found');

        return order;
    }

    async getTableOrderInfo(tableIds: number[]): Promise<OrderInfo[]> {
        const orders = await this.orderRepository.find({
            where: {
                table: { id: In(tableIds) },
                status: OrderStatus.ORDERING,
            },
            relations: ['reservation', 'orderGroup', 'table'],
        });

        if (orders.length === 0) return null;

        const result = await Promise.all(
            orders.map(async order => {
                const qrcode = await this.generateQRCode(order.id);

                return {
                    orderId: order.id,
                    tableName: order.table.name,
                    qrcode,
                } as OrderInfo;
            })
        );

        return result;
    }

    async provideOrderFeedback(orderId: string, dto: FeedbackDto): Promise<void> {
        const order = await this.findOneById(orderId);

        if (order.status !== OrderStatus.COMPLETED) {
            throw new BadRequestException('Order is not completed');
        }

        if (order.feedback) {
            throw new NotFoundException('Feedback already exists');
        }

        await this.feedbackService.create(order.id, dto);
    }

    async generateQRCode(orderId: string): Promise<string> {
        return QRcode.toDataURL(`${this.appConfig.baseUrl}/qrcode=${orderId}`);
    }
}