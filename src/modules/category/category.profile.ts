import { createMap, MappingProfile, typeConverter } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { convertToUnix } from '~/utils/date.util';

import { CategoryEntity } from './category.entity';
import { CategoryDetail, OrderCategory } from './category.model';

@Injectable()
export class CategoryProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(
                mapper,
                CategoryEntity,
                CategoryDetail,
                typeConverter(Date, Number, convertToUnix)
            );
            createMap(mapper, CategoryEntity, OrderCategory);
        };
    }
}
