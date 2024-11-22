import {
    ConsoleLogger,
    ConsoleLoggerOptions,
    Injectable,
} from '@nestjs/common';
import { config, createLogger, type Logger as WinstonLogger } from 'winston';
@Injectable()
export class LoggerService extends ConsoleLogger {
    private winstonLogger: WinstonLogger;

    constructor(context: string, options: ConsoleLoggerOptions) {
        super(context, options);
        this.initWinston();
    }

    protected initWinston(): void {
        this.winstonLogger = createLogger({
            levels: config.npm.levels,
        });
    }
}
