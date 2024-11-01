import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenEntity } from './entities/access-token.entity';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { UserModule } from '../user/user.module';

const providers = [AuthService];

@Module({
    imports: [
        TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [...providers],
})
export class AuthModule {}
