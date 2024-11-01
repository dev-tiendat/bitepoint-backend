import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import config from '~/config';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/system/role/role.module';
import { AllExceptionsFilter } from './common/filters/any-exception.filter';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
            envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
            load: [...Object.values(config)],
        }),
        DatabaseModule,
        AuthModule,
        UserModule,
        RoleModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: AllExceptionsFilter },

        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    ],
})
export class AppModule {}
