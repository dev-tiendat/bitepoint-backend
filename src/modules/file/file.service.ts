import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoryStoredFile } from 'nestjs-form-data';
import { Repository } from 'typeorm';

import { FileEntity } from './file.entity';
import {
    generateNameFile,
    getExtname,
    getFilePath,
    getFileType,
    saveLocalFile,
} from '~/utils/file.util';
import { isEmpty } from 'lodash';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(FileEntity)
        private fileRepository: Repository<FileEntity>
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

        return path;
    }
}
