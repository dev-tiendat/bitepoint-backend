import fs from 'node:fs';
import path from 'node:path';

import { MultipartFile } from '@fastify/multipart';

import dayjs from 'dayjs';
import { randomValue } from './tool.util';

export enum Type {
    IMAGE = 'image',
    TXT = 'txt',
    MUSIC = 'music',
    VIDEO = 'video',
    OTHER = 'other',
}

export function getFileType(extName: string) {
    const documents = 'txt doc pdf ppt pps xlsx xls docx';
    const music = 'mp3 wav wma mpa ram ra aac aif m4a';
    const video = 'avi mpg mpe mpeg asf wmv mov qt rm mp4 flv m4v webm ogv ogg';
    const image =
        'bmp dib pcp dif wmf gif jpg tif eps psd cdr iff tga pcd mpt png jpeg';
    if (image.includes(extName)) return Type.IMAGE;

    if (documents.includes(extName)) return Type.TXT;

    if (music.includes(extName)) return Type.MUSIC;

    if (video.includes(extName)) return Type.VIDEO;

    return Type.OTHER;
}

export function generateNameFile(extName: string) {
    const time = dayjs().format('DDMMYYYYHHmm');
    const value = randomValue(15);
    return `${value}-${time}.${extName}`;
}

export function getExtname(fileName: string) {
    return path.extname(fileName).replace('.', '');
}

export function getFilePath(name: string, type: string, isPrivate: boolean) {
    const pathFolderName = isPrivate ? 'private' : 'public';
    return `${pathFolderName}/${type}/${name}`;
}

export async function saveLocalFile(
    buffer: Buffer,
    name: string,
    type: string,
    isPrivate: boolean
) {
    const folder = isPrivate ? 'private' : 'public';
    const filePath = path.join(
        process.cwd(),
        'uploads/',
        `${folder}/`,
        `${type}/`
    );
    try {
        await fs.promises.stat(filePath);
    } catch (error) {
        await fs.promises.mkdir(filePath, { recursive: true });
    }
    const writeStream = fs.createWriteStream(filePath + name);
    writeStream.write(buffer);
}

export async function saveFile(file: MultipartFile, name: string) {
    const filePath = path.join(__dirname, '../../', 'public/upload', name);
    const writeStream = fs.createWriteStream(filePath);
    const buffer = await file.toBuffer();
    writeStream.write(buffer);
}

export async function deleteFile(name: string) {
    fs.unlink(path.join(__dirname, '../../', 'public', name), () => {});
}
