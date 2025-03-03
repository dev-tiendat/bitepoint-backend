import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import {
    HttpStatus,
    Logger,
    UnprocessableEntityException,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import path from 'node:path';
import cluster from 'cluster';
import { useContainer } from 'class-validator';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import isToday from 'dayjs/plugin/isToday';
import { AppModule } from './app.module';
import { ConfigKeyPaths, IAppConfig } from './config';
import { setupSwagger } from './setup-swagger';
import { fastifyApp } from './common/adapters/fastify.adapter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { isDev, isMainProcess } from './global/env';
import { RedisIoAdapter } from './common/adapters/socket.adapter';

declare const module: any;

const initializeLibrary = (configService: ConfigService<ConfigKeyPaths>) => {
    const { locale, timeZone } = configService.get<IAppConfig>('app');

    dayjs.locale(locale);
    dayjs.extend(isToday);
    dayjs.extend(timezone);
    dayjs.tz.setDefault(timeZone);
};

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        fastifyApp,
        {
            bufferLogs: true,
            snapshot: true,
        }
    );
    const configService = app.get(ConfigService<ConfigKeyPaths>);

    const { port, globalPrefix } = configService.get('app', { inter: true });
    const { path: swaggerPath } = configService.get('swagger', { inter: true });

    initializeLibrary(configService);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.enableVersioning({
        type: VersioningType.URI,
    });
    app.enableCors({ origin: '*', credentials: true });
    app.setGlobalPrefix(globalPrefix, { exclude: ['files/(.*)'] });
    app.useStaticAssets({ root: path.join(__dirname, '..', 'public') });
    !isDev && app.enableShutdownHooks();

    if (isDev) app.useGlobalInterceptors(new LoggingInterceptor());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            transformOptions: { enableImplicitConversion: true },
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            exceptionFactory: errors =>
                new UnprocessableEntityException(
                    errors.map(e => {
                        const rule = Object.keys(e.constraints)[0];
                        const msg = e.constraints![rule];

                        return msg;
                    })[0]
                ),
        })
    );

    app.useWebSocketAdapter(new RedisIoAdapter(app));

    setupSwagger(app, configService);
    await app.listen({ port, path: '0.0.0.0' }, async () => {
        const url = await app.getUrl();
        const { pid } = process;
        const env = cluster.isPrimary;
        const prefix = env ? 'P' : 'W';

        if (!isMainProcess) return;

        const logger = new Logger('NestApplication');
        logger.log(`[${prefix + pid}] Server running on ${url}`);

        if (isDev)
            logger.log(`[${prefix + pid}] OpenAPI: ${url}/${swaggerPath}`);
    });

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
