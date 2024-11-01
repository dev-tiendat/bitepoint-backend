import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessTokenEntity } from './access-token.entity';

@Entity({ name: 'user_refresh_tokens' })
export class RefreshTokenEntity {
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
    @JoinColumn({ name: 'access_token_id' })
    accessToken!: AccessTokenEntity;
}
