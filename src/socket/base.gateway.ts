import { Socket } from 'socket.io';

import { BusinessEvents } from './constants/business-event.constant';
import { TableEvents } from './constants/table-event.constant';

export abstract class BaseGateway {
    public gatewayMessageFormat(event: string, message: any, code?: number) {
        return { type: event, data: message, code };
    }

    handleDisconnect(client: Socket) {
        client.send(
            this.gatewayMessageFormat(
                BusinessEvents.GATEWAY_DISCONNECT,
                'WebSocket disconnected'
            )
        );
    }

    handleConnect(client: Socket) {
        client.send(
            this.gatewayMessageFormat(
                BusinessEvents.GATEWAY_CONNECT,
                'WebSocket connected'
            )
        );
    }
}

export abstract class BroadcastBaseGateway extends BaseGateway {
    broadcast(event: string, data: any) {}

    broadcastAllUserAuth(event: string, data: any) {}
}
