import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { RoleEntity } from './role.entity';
import { RoleInfo } from './role.model';

export class RoleProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(mapper, RoleEntity, RoleInfo);
        };
    }
}
