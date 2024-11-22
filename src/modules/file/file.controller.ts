import {
    Controller,
    Get,
    Header,
    NotFoundException,
    Param,
    Res,
    StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { Public } from '../auth/decorators/public.decorator';
import { Bypass } from '~/common/decorators/bypass.decorator';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller({
    path: 'files',
    version: null,
})
@ApiTags('File - Đường dẫn lấy ra file từ kho lưu trữ')
export class FileController {
    @Public()
    @Bypass()
    @Get(':path')
    async getFile(@Param('path') path: string, @Res() res: FastifyReply) {
        const file = createReadStream(
            join(process.cwd(), 'public/upload', path)
        );
        // file.on('data', data => {
        //     console.log(data);
        // });
        // file.on('error', error => {
        //     console.log(error);
        // });

        res.type('image/png').send(file);
    }
}
