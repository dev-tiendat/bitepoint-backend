import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessTokenEntity } from './access-token.entity';
import { UserEntity } from '~/modules/user/user.entity';

@Entity({ name: 'user_refresh_tokens' })
export class RefreshTokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 500 })
    value!: string;

    @Column({ type: 'datetime', name: 'expired_at' })
    expiredAt!: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @OneToOne(
        () => AccessTokenEntity,
        accessToken => accessToken.refreshToken,
        {
            onDelete: 'CASCADE',
        }
    )
    accessToken!: AccessTokenEntity;

    @ManyToOne(() => UserEntity, user => user.refreshTokens, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user!: UserEntity;
}
