import {
    createMap,
    forMember,
    mapFrom,
    MappingProfile,
    nullSubstitution,
    typeConverter,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
    TableCustomerInfo,
    OrderSummary,
    OrderInfo,
    OrderItemInfo,
    OrderDetail,
} from '../order.model';
import { Injectable } from '@nestjs/common';

import { convertToUnix } from '~/utils/date.util';

import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderEntity } from '../entities/order.entity';
import { OrderService } from '../order.service';

@Injectable()
export class OrderProfile extends AutomapperProfile {
    constructor(
        @InjectMapper() mapper,
        private orderService: OrderService
    ) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(
                mapper,
                OrderItemEntity,
                OrderItemInfo,
                typeConverter(Date, Number, convertToUnix)
            );
            createMap(
                mapper,
                OrderEntity,
                OrderInfo,
                forMember(
                    destination => destination.orderId,

                    mapFrom(source => (source ? source.id : undefined))
                ),
                forMember(
                    destination => destination.tableName,

                    mapFrom(source =>
                        source.table ? source.table.name : undefined
                    )
                ),
                forMember(
                    async destination => destination.qrcode,
                    mapFrom(
                        async source =>
                            await this.orderService.generateQRCode(source.id)
                    )
                )
            );
            createMap(
                mapper,
                OrderEntity,
                OrderSummary,
                typeConverter(Date, Number, convertToUnix)
            );
            createMap(
                mapper,
                OrderEntity,
                TableCustomerInfo,
                forMember(
                    destination => destination.customerName,
                    mapFrom(
                        source =>
                            source.reservation?.customerName ||
                            source.orderGroup?.customerName
                    )
                ),
                forMember(
                    destination => destination.guestCount,
                    mapFrom(
                        source =>
                            source.reservation?.guestCount ||
                            source.orderGroup?.guestCount
                    )
                ),
                forMember(
                    destination => destination.tableId,
                    mapFrom(source => source.table.id)
                ),
                typeConverter(Date, Number, convertToUnix)
            );
            createMap(
                mapper,
                OrderEntity,
                OrderDetail,
                typeConverter(Date, Number, convertToUnix)
            );
        };
    }
}
