import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile, typeConverter } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { convertToUnix } from '~/utils/date.util';

import { ReservationEntity } from './reservation.entity';
import { ReservationDetail } from './reservation.model';

@Injectable()
export class ReservationProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(
                mapper,
                ReservationEntity,
                ReservationDetail,
                typeConverter(Date, Number, date => convertToUnix(date))
            )
        };
    }
}
