import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { TableZoneEntity } from './table-zone.entity';
import { TableZoneInfo } from './table-zone.model';

@Injectable()
export class TableZoneProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(mapper, TableZoneEntity, TableZoneInfo);
        };
    }
}
