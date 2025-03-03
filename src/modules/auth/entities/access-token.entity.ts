import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: 'user_access_tokens' })
export class AccessTokenEntity extends BaseEntity {
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
    @JoinColumn({ name: 'refresh_token_id' })
    refreshToken!: RefreshTokenEntity;
}
