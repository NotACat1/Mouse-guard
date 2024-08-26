import { Message } from 'discord.js';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const avatarCommand: Command = {
  name: 'avatar',
  description: 'Displays the avatar of the user.',
  async execute(message: Message) {
    const user = message.mentions.users.first() || message.author;
    message.reply(
      `<@${user.id}>: ${user.displayAvatarURL({
        size: 512,
      })}`,
    );

    // Логирование команды
    logger.info(`\`${appConfig.commandStart}avatar\` command used by <@${message.author.id}> in <#${message.guild?.id}>`);
  },
};
