import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import {
    createMap,
    forMember,
    mapFrom,
    MappingProfile,
    typeConverter,
} from '@automapper/core';

import { convertToUnix } from '~/utils/date.util';

import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderItemDetail, OrderItemInfo } from '../order.model';

@Injectable()
export class OrderItemProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(
                mapper,
                OrderItemEntity,
                OrderItemInfo,
                forMember(
                    destination => destination.name,
                    mapFrom(source => source.menuItem.name)
                ),
                forMember(
                    destination => destination.image,
                    mapFrom(source => source.menuItem.image)
                ),
                typeConverter(Date, Number, convertToUnix)
            );

            createMap(
                mapper,
                OrderItemEntity,
                OrderItemDetail,
                forMember(
                    destination => destination.name,
                    mapFrom(source => source.menuItem.name)
                ),
                forMember(
                    destination => destination.orderId,
                    mapFrom(source => source.order.id)
                ),
                forMember(
                    destination => destination.image,
                    mapFrom(source => source.menuItem.image)
                ),
                forMember(
                    destination => destination.tableName,
                    mapFrom(source => source.order.table.name)
                ),
                typeConverter(Date, Number, convertToUnix)
            );
        };
    }
}
