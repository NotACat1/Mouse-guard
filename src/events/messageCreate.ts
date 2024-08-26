import { Message } from 'discord.js';
import { logger } from '@utils/logger';
import { handleSpamProtection } from '@services/spamProtectionService';

export const onMessageCreate = async (message: Message): Promise<void> => {
  if (message.author.bot) return; // Игнорируем сообщения от ботов

  try {
    // Обработка защиты от спама
    await handleSpamProtection(message);
  } catch (error) {
    logger.error(`Error handling message: ${error}`);
  }
};
