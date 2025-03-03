import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { MenuItemModule } from '../menu-item/menu-item.module';
import { CategoryModule } from '../category/category.module';
import { FeedBackModule } from '../feedback/feedback.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderGroupEntity } from './entities/order-group.entity';
import { OrderProfile } from './profiles/order.profile';
import { OrderItemProfile } from './profiles/order-item.profile';

const providers = [OrderService, OrderProfile, OrderItemProfile];

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
            OrderItemEntity,
            OrderGroupEntity,
        ]),
        UserModule,
        MenuItemModule,
        CategoryModule,
        FeedBackModule,
    ],
    controllers: [OrderController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class OrderModule {}
