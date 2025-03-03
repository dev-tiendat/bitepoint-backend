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
import { PaymentService } from '~/modules/payment-system/payment/payment.service';
import { Server, Socket } from 'socket.io';
import { PaymentEvents } from '../constants/payment-event.constant';
import { PaymentDto } from '~/modules/payment-system/payment/payment.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { EventBusEvents } from '~/constants/event-bus.constant';
import { BroadcastBaseGateway } from '../base.gateway';

const NAMESPACE = 'payment';

@WebSocketGateway<GatewayMetadata>({ namespace: NAMESPACE })
export class PaymentEventsGateway
    extends BroadcastBaseGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    private _server: Server;
    clientPaymentOrderIdMap = new Map<string, string>();

    constructor(private paymentService: PaymentService) {
        super();
    }
    handleConnection(client: any, ...args: any[]) {
        super.handleConnect(client);
    }

    handleDisconnect(client: any) {
        super.handleDisconnect(client);
        this.clientPaymentOrderIdMap.delete(client.id);
    }

    @SubscribeMessage('join-room')
    async joinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() orderId: string
    ) {
        this.clientPaymentOrderIdMap.set(client.id, orderId);

        client.join(orderId);
    }

    @SubscribeMessage('pay')
    async handlePayment(
        @ConnectedSocket() client: Socket,
        @MessageBody() payment: PaymentDto
    ) {
        const result = await this.paymentService.processPayment(
            payment.orderId,
            payment.paymentMethod
        );

        return result;
    }

    @OnEvent(EventBusEvents.PaymentSuccess)
    async handlePayMentSuccess(orderId: string) {
        const clientIds = Array.from(
            this.clientPaymentOrderIdMap.entries()
        ).filter(([_, value]) => value === orderId);

        clientIds.forEach(([clientId]) => {
            this._server
                .to(clientId)
                .emit(PaymentEvents.PAYMENT_SUCCESS, orderId);
        });
    }
}
