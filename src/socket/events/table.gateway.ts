import {
    ConnectedSocket,
    GatewayMetadata,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    type OnGatewayConnection,
    type OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectEntityManager } from '@nestjs/typeorm';

import { TableService } from '~/modules/table/table.service';
import {
    AssignTableDto,
    CheckInDto,
    FindOptimalTableDto,
} from '~/modules/table/table.dto';

import { BroadcastBaseGateway } from '../base.gateway';
import { TableEvents } from '../constants/table-event.constant';
import { OrderService } from '~/modules/order/order.service';
import { EntityManager } from 'typeorm';
import { ReservationService } from '~/modules/reservation/reservation.service';
import { ReservationStatus } from '~/modules/reservation/reservation.constant';

const NAMESPACE = 'table';

@WebSocketGateway<GatewayMetadata>({ namespace: NAMESPACE })
export class TableEventsGateway
    extends BroadcastBaseGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    private _server: Server;

    constructor(
        private tableService: TableService,
        private orderService: OrderService,
        private reservationService: ReservationService,
        @InjectEntityManager()
        private entityManager: EntityManager
    ) {
        super();
    }

    async handleConnection(client: any, ...args: any[]) {
        super.handleConnect(client);
    }

    handleDisconnect(client: any) {
        super.handleDisconnect(client);
    }

    @SubscribeMessage('cancel-reservation')
    async handleCancel(
        @ConnectedSocket() client: Socket,
        @MessageBody() reservationId: number
    ) {
        const tables =
            await this.reservationService.cancelReservation(reservationId);

        this.broadcast(
            'table-status-change',
            tables.map(t => ({ id: t.id, status: t.status }))
        );

        return [];
    }

    @SubscribeMessage('assign-table')
    async handleAssignTable(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: AssignTableDto
    ) {
        const tables = await this.tableService.reserveTables(data.tableIds);
        const reservation = await this.reservationService.changeStatus(
            data.reservationId,
            ReservationStatus.COMPLETED
        );
        this.orderService.createOrders(tables, reservation);
        this.broadcast('table-status-change', tables);

        return [];
    }

    @SubscribeMessage('check-in')
    async handleCheckIn(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: number[]
    ) {
        const table = await this.tableService.checkIn(data);
        this.broadcast('table-status-change', table);

        const result = await this.orderService.getTableOrderInfo(data);

        return this.gatewayMessageFormat(TableEvents.CHECK_IN, result);
    }

    @SubscribeMessage('clean-table')
    async handleCleanTable(
        @ConnectedSocket() client: Socket,
        @MessageBody() tableId: number
    ) {
        const table = await this.tableService.cleanTable(tableId);
        this.broadcast('table-status-change', [
            { id: table.id, status: table.status },
        ]);
    }

    @SubscribeMessage('walk-in')
    async handleWalkIn(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: number[]
    ) {
        const result = await this.entityManager.transaction(async () => {
            const tables = await this.tableService.reserveTables(data);
            const orderInfos = await this.orderService.createOrders(
                tables,
                undefined,
                undefined,
                new Date()
            );

            this.broadcast(
                'table-status-change',
                tables.map(t => ({ id: t.id, status: t.status }))
            );

            return orderInfos;
        });

        return this.gatewayMessageFormat(TableEvents.WALK_IN, result);
    }

    @SubscribeMessage('find-optimal-table')
    async handleFindOptimalTable(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: FindOptimalTableDto
    ) {
        return this.entityManager.transaction(async () => {
            const tables = await this.tableService.findOptimalTables(
                data.guestCount
            );
            await this.tableService.reserveTables(tables.map(t => t.id));
            const result = await this.orderService.createOrders(
                tables,
                null,
                data,
                new Date()
            );
            this.broadcast(
                'table-status-change',
                tables.map(t => ({ id: t.id, status: t.status }))
            );
            return this.gatewayMessageFormat(TableEvents.WALK_IN, result);
        });
    }

    broadcast(event: string, data: any) {
        this._server.emit(event, data);
    }
}
