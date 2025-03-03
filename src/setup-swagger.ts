import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './config';
import { ConfigService } from '@nestjs/config';
import { CommonEntity } from './common/entity/common.entity';
import { ResOp } from './common/model/response.model';
import { API_SECURITY_AUTH } from './common/decorators/swagger.decorator';

export function setupSwagger(
    app: INestApplication,
    configService: ConfigService<ConfigKeyPaths>
): void {
    const { name, port } = configService.get<IAppConfig>('app');
    const { enable, path, version } =
        configService.get<ISwaggerConfig>('swagger');

    if (!enable) return;

    const documentBuilder = new DocumentBuilder()
        .setTitle(name)
        .setDescription(`${name} API document `)
        .setVersion(version);

    documentBuilder.addSecurity(API_SECURITY_AUTH, {
        description: 'Nhập mã token(Enter the token): ',
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
    });

    const document = SwaggerModule.createDocument(
        app,
        documentBuilder.build(),
        {
            ignoreGlobalPrefix: false,
            extraModels: [CommonEntity, ResOp],
        }
    );
    Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
        Object.values(path).forEach((method: any) => {
            if (
                Array.isArray(method.security) &&
                method.security.includes('public')
            ) {
                method.security = [];
            }
        });
    });

    SwaggerModule.setup(path, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    const logger = new Logger('SwaggerModule');
    logger.log(`Document running on http://127.0.0.1:${port}/${path}`);
}
