import { AutoMap } from '@automapper/classes';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from '../order/entities/order.entity';

@Entity({ name: 'sys_feedback' })
export class FeedBackEntity {
    @PrimaryGeneratedColumn()
    @AutoMap()
    id: number;

    @Column({ type: 'int' })
    @AutoMap()
    rating: number;

    @Column({ type: 'text' })
    @AutoMap()
    comments: string;

    @CreateDateColumn({ name: 'created_at' })
    @AutoMap()
    createdAt: Date;

    @OneToOne(() => OrderEntity, order => order.feedback)
    @JoinColumn({ name: 'order_id' })
    @AutoMap(() => OrderEntity)
    order: OrderEntity;
}
