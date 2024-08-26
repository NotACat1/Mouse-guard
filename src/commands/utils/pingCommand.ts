import { Message } from 'discord.js';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const pingCommand: Command = {
  name: 'ping',
  description: "Checks the bot's response time.",
  execute(message: Message) {
    const ping = Math.round(message.client.ws.ping);
    message.reply(`🏓 Pong! Bot ping is ${ping} ms.`);

    // Логирование команды
    logger.info(
      `\`${appConfig.commandStart}status\` command used by <@${message.author.id}> in <#${message.guild?.id}>`,
    );
  },
};
