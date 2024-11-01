import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllConfigType } from './config';
import { setupSwagger } from './setup-swagger';
import {
    HttpStatus,
    Logger,
    UnprocessableEntityException,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import cluster from 'cluster';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastifyApp } from './common/adapters/fastify.adapter';
import { isDev, isMainProcess } from './global/env';
import { useContainer } from 'class-validator';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        fastifyApp,
        {
            bufferLogs: true,
            snapshot: true,
        }
    );

    const configService = app.get(ConfigService<AllConfigType>);

    const { port, globalPrefix } = configService.get('app', { inter: true });
    const { path } = configService.get('swagger', { inter: true });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.enableVersioning({
        type: VersioningType.URI,
    });
    app.enableCors({ origin: '*', credentials: true });
    app.setGlobalPrefix(globalPrefix);

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

    setupSwagger(app, configService);
    await app.listen({ port, path: '0.0.0.0' }, async () => {
        const url = await app.getUrl();
        const { pid } = process;
        const env = cluster.isPrimary;
        const prefix = env ? 'P' : 'W';

        if (!isMainProcess) return;

        const logger = new Logger('NestApplication');
        logger.log(`[${prefix + pid}] Server running on ${url}`);

        if (isDev) logger.log(`[${prefix + pid}] OpenAPI: ${url}/${path}`);
    });

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
