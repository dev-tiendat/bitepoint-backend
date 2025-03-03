import { Injectable } from '@nestjs/common';
import { Order, PagerDto } from '~/common/dto/pager.dto';
import { Pagination } from '~/helper/paginate/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Like, Repository } from 'typeorm';
import { VoucherEntity } from './voucher.entity';
import { paginate } from '~/helper/paginate';
import { VoucherDetail, VoucherInfo } from './voucher.model';
import { ApplyVoucherDto, VoucherDto } from './voucher.dto';
import { BizException } from '~/common/exceptions/biz.exception';
import { ErrorCode } from '~/constants/error-code.constant';
import { OrderService } from '../order/order.service';

@Injectable()
export class VoucherService {
    constructor(
        @InjectRepository(VoucherEntity)
        private voucherRepository: Repository<VoucherEntity>,
        @InjectMapper()
        private mapper: Mapper,
        private orderService: OrderService
    ) {}

    async list({
        page,
        limit: pageSize,
        query,
        field = 'id',
        order = Order.DESC,
    }: PagerDto): Promise<Pagination<VoucherDetail>> {
        const queryBuilder = this.voucherRepository
            .createQueryBuilder('voucher')
            .where({
                ...(query ? { name: Like(`%${query}%`) } : null),
            })
            .orderBy(`voucher.${field}`, order);

        return paginate<VoucherEntity, VoucherDetail>(
            queryBuilder,
            { page, pageSize },
            source => this.mapper.mapArray(source, VoucherEntity, VoucherDetail)
        );
    }

    async create(dto: VoucherDto): Promise<void> {
        await this.voucherRepository.save(dto);
    }

    async applyVoucher(dto: ApplyVoucherDto): Promise<VoucherInfo> {
        const voucher = await this.findOneByCode(dto.voucherCode);

        if (voucher.expirationDate < new Date()) {
            throw new BizException(ErrorCode.VOUCHER_EXPIRED);
        }

        this.orderService.applyVoucherToOrder(dto.orderId, voucher);

        return this.mapper.map(voucher, VoucherEntity, VoucherInfo);
    }

    async findOneByCode(code: string): Promise<VoucherEntity> {
        const voucher = await this.voucherRepository.findOneBy({ code });

        if (!voucher) {
            throw new BizException(ErrorCode.VOUCHER_NOT_FOUND);
        }

        return voucher;
    }
}
