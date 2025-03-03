import {
    createMap,
    forMember,
    mapFrom,
    MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { FeedbackDetail } from './feedback.model';
import { FeedBackEntity } from './feedback.entity';

@Injectable()
export class FeedbackProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(
                mapper,
                FeedBackEntity,
                FeedbackDetail,
                forMember(
                    destination => destination.customerName,
                    mapFrom(
                        source =>
                            source.order.reservation?.customerName ||
                            source.order.orderGroup?.customerName ||
                            (source.order.customer &&
                                source.order.customer?.firstName +
                                    ' ' +
                                    source.order.customer?.lastName)
                    )
                ),
                forMember(
                    destination => destination.tableName,
                    mapFrom(source => source.order.table.name)
                )
            );
        };
    }
}
