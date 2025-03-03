import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeedBackEntity } from './feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackProfile } from './feedback.profile';
import { FeedbackController } from './feedback.controller';

@Module({
    imports: [TypeOrmModule.forFeature([FeedBackEntity])],
    controllers: [FeedbackController],
    providers: [FeedbackService, FeedbackProfile],
    exports: [TypeOrmModule, FeedbackService, FeedbackProfile],
})
export class FeedBackModule {}
