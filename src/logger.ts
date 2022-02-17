import pino from 'pino';
import config from 'config';


export const logger = pino({
  enabled: config.get("app.logger.enabled"),
  level: config.get("app.logger.level")
});