import { Injectable } from '@nestjs/common';
import {
    createMap,
    forMember,
    mapFrom,
    Mapper,
    MappingProfile,
    typeConverter,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import dayjs from 'dayjs';

import { UserEntity } from './user.entity';
import { AccountInfo, UserDetail } from './user.model';

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(mapper, UserEntity, AccountInfo);
            createMap(
                mapper,
                UserEntity,
                UserDetail,
                typeConverter(Date, Number, date => dayjs(date).unix())
            );
        };
    }
}
