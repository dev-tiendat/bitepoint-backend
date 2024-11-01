import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '~/modules/user/user.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: 'user_access_tokens' })
export class AccessTokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 500 })
    value!: string;

    @Column({ type: 'datetime', name: 'expired_at' })
    expiredAt!: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @OneToOne(
        () => RefreshTokenEntity,
        refreshToken => refreshToken.accessToken,
        {
            cascade: true,
        }
    )
    refreshToken!: RefreshTokenEntity;

    @ManyToOne(() => UserEntity, user => user.accessTokens, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user!: UserEntity;
}
