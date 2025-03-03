import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Entity('sys_notification')
export class NotificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'varchar' })
    type: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @OneToMany(
        () => NotificationUserEntity,
        notificationUser => notificationUser.notification
    )
    notificationUsers: NotificationUserEntity[];
}

@Entity('sys_notification_users')
export class NotificationUserEntity {
    @PrimaryColumn({ name: 'notification_id', type: 'uuid' })
    notificationId: string;

    @PrimaryColumn({ name: 'user_id', type: 'int' })
    userId: number;

    @Column({ name: 'read_at', type: 'timestamp', nullable: true })
    readAt: Date;

    @ManyToOne(
        () => NotificationEntity,
        notification => notification.notificationUsers,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'notification_id' })
    notification: NotificationEntity;

    @ManyToOne(() => UserEntity, user => user.notificationUsers, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
