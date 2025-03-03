import { Controller, Get } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { EventBusEvents } from '~/constants/event-bus.constant';
import {
    definePermission,
    Perm,
} from '~/modules/auth/decorators/permission.decorator';

import { Payment } from '../gateway/gateway.interface';
import { PaymentService } from './payment.service';

const permissions = definePermission('payment', {
    LIST: 'list',
});

@Controller('payments')
@ApiTags('System - Mô dun thanh toán')
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @OnEvent(EventBusEvents.PaymentHistoryUpdated)
    handlePaymentHistoryUpdateEvent(payments: Payment[]) {
        this.paymentService.addPayments(payments);
    }

    @Get()
    @Perm(permissions.LIST)
    @ApiOperation({ summary: 'Lấy danh sách tất cả lịch sử thanh toán' })
    getPayments() {
        return this.paymentService.getPayments();
    }
}
