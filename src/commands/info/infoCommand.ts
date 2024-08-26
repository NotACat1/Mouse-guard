import { Message, Guild } from 'discord.js';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const serverInfoCommand: Command = {
  name: 'info',
  description: 'Displays information about the server.',
  async execute(message: Message) {
    const guild: Guild | null = message.guild;
    if (guild) {
      const serverInfo = `
        **Server Name:** ${guild.name}
        **Total Members:** ${guild.memberCount}
        **Created On:** ${guild.createdAt.toDateString()}
        **Owner:** ${await guild.fetchOwner().then((owner) => `<@${owner.user.id}>`)}
      `;
      message.reply(serverInfo);

      // Логирование команды
      logger.info(
        `\`${appConfig.commandStart}info\` command used by <@${message.author.id}> in <#${message.guild?.id}>`,
      );
    } else {
      message.reply('This command can only be used in a server.');
    }
  },
};
