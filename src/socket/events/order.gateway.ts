import {
    ConnectedSocket,
    GatewayMetadata,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { OrderEvents } from '../constants/order-event.constant';
import { OrderService } from '~/modules/order/order.service';
import { Server, Socket } from 'socket.io';
import {
    OrderItemDto,
    OrderItemStatusUpdateDto,
    OrderMenuItemDto,
} from '~/modules/order/order.dto';
import { createAuthGateway } from '../shared/auth.gateway';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '~/modules/auth/services/token.service';
import { CacheService } from '~/shared/redis/cache.service';

const NAMESPACE = 'order';

const AuthGateway = createAuthGateway({
    namespace: NAMESPACE,
    authRequire: false,
});

@WebSocketGateway<GatewayMetadata>({ namespace: NAMESPACE })
export class OrderEventsGateway
    extends AuthGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    private _server: Server;
    clientOrderIdMap = new Map<string, string>();

    constructor(
        private jwtService: JwtService,
        private tokenService: TokenService,
        private cacheService: CacheService,
        private orderService: OrderService
    ) {
        super(jwtService, tokenService, cacheService);
    }

    handleConnection(client: Socket): void {
        super.handleConnection(client);
    }

    handleDisconnect(client: Socket) {
        super.handleDisconnect(client);
        this.clientOrderIdMap.delete(client.id);
    }

    @SubscribeMessage('join-room')
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() orderId: string
    ) {
        this.clientOrderIdMap.set(client.id, orderId);

        client.join(orderId);
        const result = await this.orderService.findOrderItemsByOrderId(orderId);

        return result;
    }

    @SubscribeMessage('order')
    async handleOrder(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: OrderItemDto
    ) {
        const orderId = this.findOrderIdByClient(client);

        const result = await this.orderService.createOrderItems(orderId, data.items);

        this._server
            .to(data.orderId.toString())
            .emit(OrderEvents.ORDER_ITEM_UPDATE, result);
        super.broadcastAllUserAuth(OrderEvents.ORDER_ITEM_UPDATE, result);
    }

    @SubscribeMessage('urgent-order')
    async handleUrgentOrder(
        @ConnectedSocket() client: Socket,
        @MessageBody() orderItemId: number
    ) {
        const result = await this.orderService.urgeOrderItem(orderItemId);

        const clientOrderId = this.clientOrderIdMap.get(client.id);

        this._server
            .to(clientOrderId)
            .emit(OrderEvents.ORDER_ITEM_UPDATE, result);
        super.broadcastAllUserAuth(OrderEvents.ORDER_ITEM_UPDATE, result);
    }

    @SubscribeMessage('cancel-order-item')
    async handleCancelOrder(
        @ConnectedSocket() client: Socket,
        @MessageBody() orderItemId: number
    ) {
        const result = await this.orderService.cancelOrderItem(orderItemId);

        const clientOrderId = this.clientOrderIdMap.get(client.id);

        this._server
            .to(clientOrderId)
            .emit(OrderEvents.ORDER_ITEM_UPDATE, result);
        super.broadcastAllUserAuth(OrderEvents.ORDER_ITEM_UPDATE, result);
    }

    @SubscribeMessage('next-step-order-item')
    async handleOrderItemNextStep(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: OrderItemStatusUpdateDto
    ) {
        const result = await this.orderService.advanceOrderItemStatus(
            data.orderItemId
        );
        this._server
            .to(data.orderId.toString())
            .emit(OrderEvents.ORDER_ITEM_UPDATE, result);
        super.broadcastAllUserAuth(OrderEvents.ORDER_ITEM_UPDATE, result);
    }

    findOrderIdByClient(client: Socket) {
        return this.clientOrderIdMap.get(client.id);
    }

    broadcast(event: OrderEvents, data: any) {
        this._server.emit(event, data);
    }
}
