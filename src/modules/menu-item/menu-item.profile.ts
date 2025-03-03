import { Injectable } from '@nestjs/common';
import {
    createMap,
    forMember,
    mapFrom,
    MappingProfile,
    typeConverter,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { convertToUnix } from '~/utils/date.util';

import { MenuItemEntity } from './entities/menu-item.entity';
import { MenuItemDetail, MenuItemInfo } from './menu-item.model';

@Injectable()
export class MenuItemProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(
                mapper,
                MenuItemEntity,
                MenuItemInfo,
                forMember(
                    destination => destination.price,
                    mapFrom(
                        source =>
                            source.historyPrices.sort(
                                (a, b) =>
                                    b.createdAt.getTime() -
                                    a.createdAt.getTime()
                            )[0]?.price
                    )
                )
            );
            createMap(
                mapper,
                MenuItemEntity,
                MenuItemDetail,
                forMember(
                    destination => destination.currentPrice,
                    mapFrom(
                        source =>
                            source.historyPrices.sort(
                                (a, b) =>
                                    b.createdAt.getTime() -
                                    a.createdAt.getTime()
                            )[0]?.price
                    )
                ),
                forMember(
                    destination => destination.categoryId,
                    mapFrom(source => source.category.id)
                ),
                typeConverter(Date, Number, convertToUnix)
            );
            createMap(
                mapper,
                MenuItemEntity,
                MenuItemInfo,
                forMember(
                    destination => destination.price,
                    mapFrom(
                        source =>
                            source.historyPrices.sort(
                                (a, b) =>
                                    b.createdAt.getTime() -
                                    a.createdAt.getTime()
                            )[0]?.price
                    )
                ),
                typeConverter(Date, Number, convertToUnix)
            );
        };
    }
}
