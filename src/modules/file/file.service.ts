import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemoryStoredFile } from 'nestjs-form-data';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { isEmpty } from 'lodash';

import { AppConfig, IAppConfig } from '~/config';
import {
    generateNameFile,
    getExtname,
    getFilePath,
    getFileType,
    saveLocalFile,
} from '~/utils/file.util';

import { FileEntity } from './file.entity';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(FileEntity)
        private fileRepository: Repository<FileEntity>,
        @Inject(AppConfig.KEY)
        private appConfig: IAppConfig
    ) {}

    async saveFile(file: MemoryStoredFile, uid?: number): Promise<string> {
        const isPrivate = !isEmpty(uid);
        const extName = getExtname(file.originalName);
        const type = getFileType(extName);
        const fileName = generateNameFile(extName);
        const path = getFilePath(fileName, type, isPrivate);

        saveLocalFile(await file.buffer, fileName, type, isPrivate);

        await this.fileRepository.save({
            fileName,
            path,
            type,
            user: { id: uid },
            isPrivate,
        });

        return `${this.appConfig.baseUrl}/files/${fileName}`;
    }

    async getFile(name: string): Promise<{ file: ReadStream; type: string }> {
        const fileInfo = await this.fileRepository.findOneBy({
            fileName: name,
        });
        if (isEmpty(fileInfo)) throw new NotFoundException('File not found');

        const file = createReadStream(
            join(process.cwd(), 'uploads', fileInfo.path)
        );

        return { file, type: fileInfo.type };
    }
}
