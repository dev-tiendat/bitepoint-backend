import { FastifyRequest } from 'fastify';
import { IncomingMessage } from 'http';

export function getIp(request: FastifyRequest | IncomingMessage) {
    const req = request as any;

    let ip: string =
        request.headers['x-forwarded-for'] ||
        request.headers['X-Forwarded-For'] ||
        request.headers['X-Real-IP'] ||
        request.headers['x-real-ip'] ||
        req?.ip ||
        req?.raw?.connection?.remoteAddress ||
        req?.raw?.socket?.remoteAddress ||
        undefined;
    if (ip && ip.split(',').length > 0) ip = ip.split(',')[0];

    return ip;
}