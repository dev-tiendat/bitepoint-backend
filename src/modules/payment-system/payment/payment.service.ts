import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import moment from 'moment-timezone';
import { Repository } from 'typeorm';
import { QRBank, BankData } from 'qrbank';

import { EventBusEvents } from '~/constants/event-bus.constant';
import { InjectRedis } from '~/common/decorators/inject-redis.decorator';
import { WsBusinessException } from '~/common/exceptions/ws-biz.exception';
import { NotificationType } from '~/modules/notification/notification.constant';
import { OrderService } from '~/modules/order/order.service';
import { TableService } from '~/modules/table/table.service';
import { UserService } from '~/modules/user/user.service';
import { OrderEntity } from '~/modules/order/entities/order.entity';

import { GateWayType, Payment } from '../gateway/gateway.interface';
import { GatesManagerService } from '../gateway/gateway-manager.service';
import { PaymentMethod, PaymentStatus } from './payment.constant';
import { PaymentEntity } from './payment.entity';
import { PaymentInfo } from './payment.model';

@Injectable()
export class PaymentService implements OnApplicationBootstrap {
    private payments: Payment[] = [];

    constructor(
        @InjectRedis()
        private redis: Redis,
        private eventEmitter: EventEmitter2,
        @InjectRepository(PaymentEntity)
        private paymentRepository: Repository<PaymentEntity>,
        private configService: ConfigService,
        private gatesManagerService: GatesManagerService,
        private orderService: OrderService,
        private userService: UserService,
        private tableService: TableService
    ) {}

    async onApplicationBootstrap() {
        if (this.configService.get('DISABLE_SYNC_REDIS') == 'true') return;

        const payments = await this.redis.get('payments');
        if (payments) {
            this.payments = JSON.parse(payments).map(el => ({
                ...el,
                date: new Date(el.date),
            }));
        }
    }

    async processPayment(
        orderId: string,
        paymentMethod: PaymentMethod,
        staffId?: number
    ) {
        const payment = await this.paymentRepository.findOne({
            where: { order: { id: orderId } },
        });
        const order = await this.orderService.findOneById(orderId);

        if (!order) {
            throw new WsBusinessException('Order not found');
        }

        if (payment) {
            if (payment.paymentStatus === PaymentStatus.SUCCESS) {
                throw new WsBusinessException('Payment has been processed');
            } else if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
                return this.generatePaymentInfo(order);
            } else if (paymentMethod === PaymentMethod.CASH) {
                payment.paymentStatus = PaymentStatus.SUCCESS;
                payment.paymentTime = new Date();
                await this.paymentRepository.save(payment);
                await this.orderService.markOrderAsCompleted(orderId);
                await this.tableService.markTableAsCleaning(order.table.id);
                this.eventEmitter.emit(EventBusEvents.PaymentSuccess, orderId);
                return;
            }
        }

        const user = staffId
            ? await this.userService.findOneById(staffId)
            : null;

        if (staffId && !user) {
            throw new WsBusinessException('Staff not found');
        }

        const paidAmount = order.voucher
            ? Math.max(order.totalPrice - order.voucher.discount, 0)
            : order.totalPrice;

        const newPayment = this.paymentRepository.create({
            paymentMethod,
            paidAmount,
            order,
            paymentStatus:
                paymentMethod === PaymentMethod.CASH
                    ? PaymentStatus.SUCCESS
                    : PaymentStatus.PENDING,
            paymentTime:
                paymentMethod === PaymentMethod.CASH ? new Date() : undefined,
            staff: paymentMethod === PaymentMethod.CASH ? user : undefined,
        });

        await this.paymentRepository.save(newPayment);

        if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
            return this.generatePaymentInfo(order);
        } else {
            await this.orderService.markOrderAsCompleted(orderId);
            await this.tableService.markTableAsCleaning(order.table.id);
            this.eventEmitter.emit(EventBusEvents.PaymentSuccess, orderId);
            this.eventEmitter.emit(EventBusEvents.NotificationSend, {
                type: NotificationType.PAYMENT_SUCCESS,
                data: { tableName: order.table.name, totalAmount: paidAmount },
            });
        }
    }

    removeHyphensFromUUID(uuid: string): string {
        return uuid.replace(/-/g, '');
    }

    async generatePaymentInfo(
        order: OrderEntity
    ): Promise<PaymentInfo[] | null> {
        const gates = this.gatesManagerService.getGateConfigs();
        const result = Promise.all(
            gates.map(async gate => {
                const bankBinMap = {
                    [GateWayType.MB_BANK]: BankData.mbbank.bin,
                    [GateWayType.TP_BANK]: BankData.tpbank.bin,
                };
                const content = this.removeHyphensFromUUID(order.id);
                const qrCode = await QRBank.initQRBank({
                    bankBin: bankBinMap[gate.type],
                    bankNumber: gate.account,
                    amount: (
                        order.totalPrice - (order.voucher?.discount || 0)
                    ).toString(),
                    purpose: content,
                });
                return {
                    account: gate.account,
                    qrCode: await qrCode.generateQRCode(),
                    bank: gate.type,
                    amount: order.totalPrice - (order.voucher?.discount || 0),
                    content: content,
                    name: gate.name,
                } as unknown as PaymentInfo;
            })
        );

        return result;
    }

    extractOrderId(content: string): string | null {
        const uuidRegex =
            /[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}/;
        const cleanedContent = content.replace(/\s+/g, '');
        const match = cleanedContent.match(uuidRegex);
        return match ? match[0] : null;
    }

    async processSuccessfulPayment(p: Payment) {
        const orderId = this.extractOrderId(p.content);

        if (!orderId) return;

        const payment = await this.findPaymentByOrderId(orderId);

        if (!payment || payment.paymentStatus !== PaymentStatus.PENDING) {
            return;
        }

        if (p.amount !== payment.paidAmount) {
            return;
        }

        payment.transactionId = p.transaction_id;
        payment.paymentStatus = PaymentStatus.SUCCESS;
        payment.paymentTime = new Date();
        await this.orderService.markOrderAsCompleted(payment.order.id);
        await this.tableService.markTableAsCleaning(payment.order.table.id);
        await await this.paymentRepository.save(payment);

        this.eventEmitter.emit(EventBusEvents.PaymentSuccess, payment.order.id);
        this.eventEmitter.emit(EventBusEvents.NotificationSend, {
            type: NotificationType.PAYMENT_SUCCESS,
            data: {
                tableName: payment.order.table.name,
                totalAmount: payment.paidAmount,
            },
        });
    }

    async saveRedis() {
        await this.redis.set('payments', JSON.stringify(this.payments));
    }

    isExists(payment: Payment) {
        return this.payments.some(
            el => el.transaction_id == payment.transaction_id
        );
    }

    replaceDateTodayAndNoTime = (date: Date): Date => {
        const dateMoment = moment.tz(date, 'Asia/Ho_Chi_Minh');
        const dateNow = moment().tz('Asia/Ho_Chi_Minh');
        const dateNoTime =
            dateMoment.get('hour') == 0 &&
            dateMoment.get('minute') == 0 &&
            dateMoment.get('second') == 0;

        if (dateMoment.isSame(dateNow, 'day') && dateNoTime) {
            return new Date();
        }
        return date;
    };

    async addPayments(payments: Payment[]) {
        const newPayments = payments.filter(payment => !this.isExists(payment));
        const replaceDateTimeNewPayments = newPayments.map(payment => ({
            ...payment,
            date: this.replaceDateTodayAndNoTime(payment.date),
        }));

        if (replaceDateTimeNewPayments.length == 0) return;

        this.eventEmitter.emit(
            EventBusEvents.PaymentCreated,
            replaceDateTimeNewPayments
        );

        this.payments.push(...replaceDateTimeNewPayments);

        this.payments = this.payments
            .slice(-500)
            .sort((a, b) => b.date.getTime() - a.date.getTime());

        await Promise.all(
            newPayments.map(this.processSuccessfulPayment.bind(this))
        );

        this.saveRedis();
    }

    private formatOrderId(orderId: string): string {
        return orderId.replace(
            /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
            '$1-$2-$3-$4-$5'
        );
    }

    async findPaymentByOrderId(orderId: string): Promise<PaymentEntity> {
        const formattedOrderId = this.formatOrderId(orderId);
        return this.paymentRepository.findOne({
            where: { order: { id: formattedOrderId } },
            relations: ['order', 'order.table'],
        });
    }

    getPayments(): Payment[] {
        return this.payments;
    }
}
