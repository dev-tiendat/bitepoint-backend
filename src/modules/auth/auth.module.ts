import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { ConfigKeyPaths, ISecurityConfig } from '~/config';
import { isDev } from '~/global/env';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenEntity } from './entities/access-token.entity';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AccountController } from './controllers/account.controller';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../system/role/role.module';
import { MenuModule } from '../system/menu/menu.module';
import { OrderModule } from '../order/order.module';
import { EmailController } from './controllers/email.controller';
import { LogModule } from '../system/log/log.module';

const controllers = [AccountController, EmailController];
const providers = [AuthService, TokenService];
const strategies = [LocalStrategy, JwtStrategy];

@Module({
    imports: [
        TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
                const { jwtSecret, jwtExpire } =
                    configService.get<ISecurityConfig>('security');
                return {
                    secret: jwtSecret,
                    signOptions: {
                        expiresIn: `${jwtExpire}s`,
                    },
                    verifyOptions: {
                        ignoreExpiration: isDev,
                    },
                };
            },
            inject: [ConfigService],
        }),
        forwardRef(() => UserModule),
        RoleModule,
        MenuModule,
        OrderModule,
        LogModule,
    ],
    controllers: [AuthController, ...controllers],
    providers: [...providers, ...strategies],
    exports: [TypeOrmModule, JwtModule, ...providers],
})
export class AuthModule {}
