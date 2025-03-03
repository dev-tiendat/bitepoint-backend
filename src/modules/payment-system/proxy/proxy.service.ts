import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as https from 'https';
import * as crypto from 'crypto';

import { axios } from '~/helper/axios';
import { ConfigKeyPaths } from '~/config';

import { ProxyConfig } from './proxy.interfaces';

@Injectable()
export class ProxyService implements OnApplicationBootstrap {
    private proxies: ProxyConfig[] = [];
    constructor(private configService: ConfigService<ConfigKeyPaths>) {}

    async onApplicationBootstrap() {
        this.proxies =
            this.configService.get('payment.proxies') || [];
    }
    async getProxy(name: string): Promise<ProxyConfig | null> {
        if (!name || name.length == 0) {
            return null;
        }

        const proxy = this.proxies.find(
            value => value.name.toLowerCase() === name.toLowerCase()
        );

        if (!proxy) {
            return null;
        }

        if (
            proxy.change_url &&
            proxy.change_url.length > 0 &&
            proxy.change_interval_in_sec > 0
        ) {
            if (!proxy.last_change_ip) {
                proxy.last_change_ip = Date.now();
            }

            if (
                Date.now() - proxy.last_change_ip >
                proxy.change_interval_in_sec * 1000
            ) {
                proxy.last_change_ip = Date.now();
                try {
                    await axios.get(proxy.change_url);
                    console.info(`Refresh ip of proxy ${proxy.name} success:`);
                } catch (e) {
                    console.error(
                        `Error while refresh ip of proxy ${proxy.name}`,
                        e
                    );
                }
            }
        }

        return proxy;
    }

    async getProxyAgent(name: string) {
        const proxy = await this.getProxy(name);

        if (proxy) {
            if (proxy.username) {
                return new HttpsProxyAgent(
                    `${proxy.schema}://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
                );
            }
            return new HttpsProxyAgent(
                `${proxy.schema}://${proxy.ip}:${proxy.port}`
            );
        }
        return new https.Agent({
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        });
    }
}
