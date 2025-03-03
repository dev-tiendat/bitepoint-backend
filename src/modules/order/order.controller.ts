import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResult } from '~/common/decorators/api-result.decorator';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';

import { Public } from '../auth/decorators/public.decorator';
import {
    definePermission,
    Perm,
} from '../auth/decorators/permission.decorator';
import { OrderCategory } from '../category/category.model';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { FeedbackDto } from '../feedback/feedback.dto';
import { OrderService } from './order.service';
import { OrderIdParam } from './decorators/order-id-param.decorator';

const permissions = definePermission('order', {
    LIST: 'list',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    LINK_CUSTOMER: 'link_customer',
});

@Controller({
    path: 'orders',
    version: '1',
})
@ApiSecurityAuth()
@ApiTags('Order - Mô đun quản lý đặt hàng')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get('menus')
    @Public()
    @ApiOperation({ summary: 'Lấy danh sách thực đơn' })
    @ApiResult({ type: OrderCategory })
    async menuList() {
        return this.orderService.getOrderMenuList();
    }

    @Get('menu-items/:id')
    @Public()
    @ApiOperation({ summary: 'Lấy danh sách món ăn đã đặt' })
    async orderItemListById(@OrderIdParam() id: string) {
        return this.orderService.listMenuItemsByOrderId(id);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Lấy thông tin chi tiết đơn hàng' })
    async detail(@OrderIdParam() id: string) {
        return this.orderService.getOrderDetail(id);
    }

    @Get('order-items')
    @ApiOperation({ summary: 'Lấy danh sách các món ăn đơn hàng đặt trong ngày' })
    @Perm(permissions.LIST)
    @ApiResult({ type: OrderCategory })
    async orderItemDetailList() {
        return this.orderService.listOrderItems();
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách đơn hàng' })
    async list() {
        return this.orderService.listOrders();
    }

    @Post(':id/link-customer')
    @Perm(permissions.LINK_CUSTOMER)
    @ApiOperation({ summary: 'Liên kết khách hàng với đơn hàng' })
    async linkCustomer(
        @AuthUser('uid') uid: number,
        @OrderIdParam() orderId: string
    ) {
        return this.orderService.linkCustomerToOrder(orderId, uid);
    }

    @Post(':id/feedback')
    @Public()
    @ApiOperation({ summary: 'Gửi phản hồi cho đơn hàng' })
    async feedback(
        @OrderIdParam() orderId: string,
        @Body() feedback: FeedbackDto
    ) {
        return this.orderService.provideOrderFeedback(orderId, feedback);
    }
}