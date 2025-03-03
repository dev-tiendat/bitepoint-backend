import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { UserEntity } from '~/modules/user/user.entity';
import { AccountInfo } from '~/modules/user/user.model';

export class RoleProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(mapper, UserEntity, AccountInfo);
        };
    }
}
