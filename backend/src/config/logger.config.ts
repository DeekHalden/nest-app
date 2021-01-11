import winston, { format, transports } from 'winston';

export class LoggerConfig {
  private readonly options: winston.LoggerOptions;

  constructor() {
    this.options = {
      levels: {
        error: 0,
        info: 1,
        debug: 2,
      },
      exitOnError: false,
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf((msg) => {
          return `${msg.timestamp} - [${msg.label}]:[${msg.level}]: ${msg.message}`;
        }),
      ),
      transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log', level: 'debug' }),
        new transports.Console(/* { level: 'debug' } */),
      ],
    };
  }

  public console(): winston.LoggerOptions {
    return this.options;
  }
}
