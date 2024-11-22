import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ClsModule } from 'nestjs-cls';
import { FastifyRequest } from 'fastify';

import config from '~/config';
import { AllExceptionsFilter } from './common/filters/any-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { SystemModule } from './modules/system/system.module';
import { TableZoneModule } from './modules/table-zone/table-zone.module';
import { FileModule } from './modules/file/file.module';
import { TableTypeModule } from './modules/table-type/table-type.module';
import { TableModule } from './modules/table/table.module';
import { CategoryModule } from './modules/category/category.module';
import { MenuItemModule } from './modules/menu-item/menu-item.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
            envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
            load: [...Object.values(config)],
        }),
        ClsModule.forRoot({
            global: true,
            interceptor: {
                mount: true,
                setup(cls, context) {
                    const request = context
                        .switchToHttp()
                        .getRequest<
                            FastifyRequest<{ Params: { id?: string } }>
                        >();
                    if (request.params?.id && request.body) {
                        cls.set(
                            'operateId',
                            Number.parseInt(request.params.id)
                        );
                    }
                },
            },
        }),
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        NestjsFormDataModule.config({
            isGlobal: true,
        }),
        SharedModule,
        DatabaseModule,
        FileModule,

        AuthModule,
        SystemModule,
        TableZoneModule,
        TableTypeModule,
        TableModule,
        CategoryModule,
        MenuItemModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: AllExceptionsFilter },

        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
        { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },

        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
    ],
})
export class AppModule {}
