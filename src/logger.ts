import * as winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { config } from 'config/config';

const loggingWinston = new LoggingWinston();

const level2severity = {
  emerg: 'EMERGENCY',
  alert: 'ALERT',
  crit: 'CRITICAL',
  error: 'ERROR',
  warning: 'WARNING',
  notice: 'NOTICE',
  info: 'INFO',
  debug: 'DEBUG',
};

const severity = winston.format(info => {
  return { ...info, severity: level2severity[info.level] };
});

const transports: any[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      severity(),
      winston.format.json(),
    ),
  }),
];
if (process.env.ENV === 'pro') {
  transports.push(loggingWinston);
}

export const logger = winston.createLogger({
  transports,
  levels: winston.config.syslog.levels,
  level: config.log.level,
});
