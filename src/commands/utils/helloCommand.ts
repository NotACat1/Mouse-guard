import { Message } from 'discord.js';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const helloCommand: Command = {
  name: 'hello',
  description: 'Greets the user who sent the message.',
  async execute(message: Message) {
    message.reply(`👋 Hello, ${message.author}!`);

    // Логирование команды
    logger.info(
      `\`${appConfig.commandStart}hello\` command used by <@${message.author.id}> in <#${message.guild?.id}>`,
    );
  },
};
