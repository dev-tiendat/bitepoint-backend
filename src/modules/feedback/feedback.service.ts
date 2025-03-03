import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapper } from '@automapper/core';
import { Repository } from 'typeorm';

import { FeedBackEntity } from './feedback.entity';
import { FeedbackDto } from './feedback.dto';
import { FeedbackDetail } from './feedback.model';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectRepository(FeedBackEntity)
        private feedbackRepository: Repository<FeedBackEntity>,
        @InjectMapper()
        private mapper: Mapper
    ) {}

    async list(): Promise<FeedbackDetail[]> {
        const result = await this.feedbackRepository.find({
            relations: [
                'order',
                'order.reservation',
                'order.orderGroup',
                'order.customer',
                'order.table',
            ],
        });
        return this.mapper.mapArray(result, FeedBackEntity, FeedbackDetail);
    }

    async create(orderId: string, dto: FeedbackDto) {
        return this.feedbackRepository.save({
            ...dto,
            order: { id: orderId },
        });
    }
}
