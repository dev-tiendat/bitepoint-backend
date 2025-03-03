import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SseModule } from '../sse/sse.module';
import { UserModule } from '../user/user.module';
import {
    NotificationEntity,
    NotificationUserEntity,
} from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

const providers = [NotificationService];

@Module({
    imports: [
        TypeOrmModule.forFeature([NotificationEntity, NotificationUserEntity]),
        UserModule,
        SseModule,
    ],
    controllers: [NotificationController],
    providers,
    exports: [TypeOrmModule],
})
export class NotificationModule {}
