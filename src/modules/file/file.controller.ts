import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { Bypass } from '~/common/decorators/bypass.decorator';

import { Public } from '../auth/decorators/public.decorator';
import { FileService } from './file.service';

@Controller({
    path: 'files',
    version: null,
})
@ApiTags('File - Đường dẫn lấy ra file từ kho lưu trữ')
export class FileController {
    constructor(private fileService: FileService) {}
    @Public()
    @Bypass()
    @Get(':path')
    async getFile(@Param('path') fileName: string, @Res() res: FastifyReply) {
        const file = await this.fileService.getFile(fileName);
        
        res.send(file);
    }
}
