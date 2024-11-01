import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllConfigType, IAppConfig, ISwaggerConfig } from './config';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(
    app: INestApplication,
    configService: ConfigService<AllConfigType>
): void {
    const { name, port } = configService.get<IAppConfig>('app');
    const { enable, path, version } =
        configService.get<ISwaggerConfig>('swagger');

    if (!enable) return;

    const documentBuilder = new DocumentBuilder()
        .setTitle(name)
        .setDescription(`${name} API document`)
        .setVersion(version);

    const document = () =>
        SwaggerModule.createDocument(app, documentBuilder.build());
    SwaggerModule.setup(path, app, document);

    const logger = new Logger('SwaggerModule');
    logger.log(`Document running on http://127.0.0.1:${port}/${path}`);
}
