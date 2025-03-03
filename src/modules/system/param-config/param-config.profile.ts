import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile, typeConverter } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import dayjs from 'dayjs';

import { ParamConfigInfo } from './param-config.model';
import { ParamConfigEntity } from './param-config.entity';

@Injectable()
export class ParamConfigProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(
                mapper,
                ParamConfigEntity,
                ParamConfigInfo,
                typeConverter(Date, Number, date => dayjs(date).unix())
            )
        }
    }
}
