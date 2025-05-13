import { FastifyRequest } from 'fastify';
import { IncomingMessage } from 'http';

import axios from 'axios';

function isLAN(ip: string) {
    ip.toLowerCase();
    if (ip === 'localhost' || ip === '::1') return true;
    let a_ip = 0;
    if (ip === '') return false;
    const aNum = ip.split('.');
    if (aNum.length !== 4) return false;
    a_ip += Number.parseInt(aNum[0]) << 24;
    a_ip += Number.parseInt(aNum[1]) << 16;
    a_ip += Number.parseInt(aNum[2]) << 8;
    a_ip += Number.parseInt(aNum[3]) << 0;
    a_ip = (a_ip >> 16) & 0xffff;
    return (
        a_ip >> 8 === 0x7f ||
        a_ip >> 8 === 0xa ||
        a_ip === 0xc0a8 ||
        (a_ip >= 0xac10 && a_ip <= 0xac1f)
    );
}

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

export async function getIpAddress(ip: string) {
    if (isLAN(ip)) return 'Mạng cục bộ';
    try {
        let { data } = await axios.get(
            `https://geo.ipify.org/api/v2/country?apiKey=${process.env.GEO_API_KEY}&ipAddress=${ip}`,
            { responseType: 'arraybuffer' }
        );
        data = new TextDecoder('gbk').decode(data);
        data = JSON.parse(data);
        console.log(data);

        return data.location.region;
    } catch (error) {
        return 'Yêu cầu tới API bên thứ ba thất bại';
    }
}
