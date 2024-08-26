import { Client } from 'discord.js';

import { logger } from '@utils/logger';

export const ready = (client: Client): void => {
  logger.info(`Logged in as ${client.user?.tag}`);
};
