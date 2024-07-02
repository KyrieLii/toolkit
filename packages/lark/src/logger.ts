import { logger } from 'rslog';

if (process.env.DEBUG === 'true') {
  logger.level = 'verbose';
}

export { logger };
