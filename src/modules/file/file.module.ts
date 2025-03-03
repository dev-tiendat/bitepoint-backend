import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileEntity } from './file.entity';

const providers = [FileService];

@Module({
    imports: [TypeOrmModule.forFeature([FileEntity])],
    controllers: [FileController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class FileModule {}
