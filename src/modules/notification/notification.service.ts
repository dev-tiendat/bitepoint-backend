import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';

import { EventBusEvents } from '~/constants/event-bus.constant';

import { UserService } from '../user/user.service';
import { SseService } from '../sse/sse.service';
import {
    NotificationEntity,
    NotificationUserEntity,
} from './notification.entity';
import { NotificationType } from './notification.constant';
import { NotificationStrategyFactory } from './notification-strategy-factory/notification-strategy.factory';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private notificationRepository: Repository<NotificationEntity>,
        @InjectRepository(NotificationUserEntity)
        private notificationUserRepository: Repository<NotificationUserEntity>,
        private userService: UserService,
        private sseService: SseService
    ) {}

    async list(userId: number): Promise<NotificationEntity[]> {
        return this.notificationRepository.find({
            where: { notificationUsers: { user: { id: userId } } },
            order: { createdAt: 'DESC' },
        });
    }

    @OnEvent(EventBusEvents.NotificationSend)
    async sendNotificationToWaiter({
        type,
        data,
    }: {
        type: NotificationType;
        data: any;
    }) {
        const strategy = NotificationStrategyFactory.getStrategy(type);
        const title = strategy.generateTitle(type, data);
        const message = strategy.generateMessage(type, data);

        const notification = this.notificationRepository.create({
            type,
            title,
            message,
        });
        const result = await this.notificationRepository.save(notification);

        const userIds = await this.userService.findAllWaiterIds();
        const notificationUsers = userIds.map(userId => {
            return this.notificationUserRepository.create({
                notificationId: notification.id,
                userId,
            });
        });

        await this.sseService.sendDataToClientByUserIds(userIds, result);

        await this.notificationUserRepository.save(notificationUsers);
    }
}
