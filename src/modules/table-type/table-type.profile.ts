import { Injectable } from '@nestjs/common';
import {
    createMap,
    Mapper,
    MappingProfile,
    typeConverter,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { TableTypeEntity } from './table-type.entity';
import { TableTypeDetail } from './table-type.model';
import { convertToUnix } from '~/utils/date.util';

@Injectable()
export class TableTypeProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(
                mapper,
                TableTypeEntity,
                TableTypeDetail,
                typeConverter(Date, Number, date => convertToUnix(date))
            );
        };
    }
}
