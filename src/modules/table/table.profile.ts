import {
    createMap,
    forMember,
    mapFrom,
    Mapper,
    MappingProfile,
    typeConverter,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { convertToUnix } from '~/utils/date.util';

import { TableEntity } from './table.entity';
import { TableDetail, TableInfo } from './table.model';

@Injectable()
export class TableProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(
                mapper,
                TableEntity,
                TableInfo,
                forMember(
                    destination => destination.image,
                    mapFrom(source => source.tableType.image)
                )
            );
            createMap(
                mapper,
                TableEntity,
                TableDetail,
                forMember(
                    destination => destination.image,
                    mapFrom(source => source.tableType.image)
                ),
                forMember(
                    destination => destination.tableZoneId,
                    mapFrom(source => source.tableZone.id)
                ),
                typeConverter(Date, Number, date => convertToUnix(date))
            );
        };
    }
}
