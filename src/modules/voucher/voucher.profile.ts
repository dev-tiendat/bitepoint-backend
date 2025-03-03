import { createMap, Mapper, typeConverter } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { VoucherEntity } from './voucher.entity';
import { VoucherDetail, VoucherInfo } from './voucher.model';
import { convertToUnix } from '~/utils/date.util';

@Injectable()
export class VoucherProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile() {
        return mapper => {
            createMap(mapper, VoucherEntity, VoucherInfo);
            createMap(
                mapper,
                VoucherEntity,
                VoucherDetail,
                typeConverter(Date, Number, date => convertToUnix(date))
            );
        };
    }
}
