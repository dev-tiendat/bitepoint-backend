import { Logger } from '@nestjs/common';
import { Logger as ITypeORMLogger, LoggerOptions, LogLevel } from 'typeorm';

export class TypeORMLogger implements ITypeORMLogger {
    private logger = new Logger(TypeORMLogger.name);
    constructor(private options: LoggerOptions) {}

    logQuery(query: string, parameters?: any[]) {
        if (!this.isEnable('query')) return;

        const sql =
            query +
            (parameters && parameters.length
                ? `-- PARAMETERS : ${this.stringifyParams(parameters)}`
                : '');

        this.logger.log(`[QUERY]: ${sql}`);
    }

    logQueryError(error: string | Error, query: string, parameters?: any[]) {
        if (!this.isEnable('error')) return;

        const sql =
            query +
            (parameters && parameters.length
                ? `-- PARAMETERS : ${this.stringifyParams(parameters)}`
                : '');

        this.logger.error(`[FAILED QUERY]: ${sql}`, `QUERY ERROR: ${error}`);
    }

    logQuerySlow(time: number, query: string, parameters?: any[]) {
        const sql =
            query +
            (parameters && parameters.length
                ? ` -- PARAMETERS: ${this.stringifyParams(parameters)}`
                : '');

        this.logger.warn(`[SLOW QUERY: ${time} ms]: ${sql}`);
    }

    logSchemaBuild(message: string) {
        if (!this.isEnable('schema')) return;

        this.logger.log(message);
    }

    logMigration(message: string) {
        if (!this.isEnable('migration')) return;

        this.logger.log(message);
    }

    log(level: 'log' | 'info' | 'warn', message: any) {
        if (!this.isEnable(level)) return;

        switch (level) {
            case 'log':
                this.logger.debug(message);
                break;
            case 'info':
                this.logger.log(message);
                break;
            case 'warn':
                this.logger.warn(message);
                break;
            default:
                break;
        }
    }

    private stringifyParams(parameters: any[]) {
        try {
            return JSON.stringify(parameters);
        } catch (error) {
            return parameters;
        }
    }

    private isEnable(level: LogLevel): boolean {
        return (
            this.options === 'all' ||
            this.options === true ||
            (Array.isArray(this.options) && this.options.includes(level))
        );
    }
}
