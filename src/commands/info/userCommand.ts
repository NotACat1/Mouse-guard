import { Message, EmbedBuilder } from 'discord.js';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const userCommand: Command = {
  name: 'userinfo',
  description: 'Displays information about the user.',
  async execute(message: Message) {
    const user = message.author;
    const member = message.guild?.members.cache.get(user.id);

    const userInfoEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`User Info: <@${user.id}>`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'User ID', value: user.id, inline: true },
        { name: 'Nickname', value: member?.nickname || 'None', inline: true },
        {
          name: 'Joined Server',
          value: member?.joinedAt?.toDateString() || 'N/A',
          inline: true,
        },
        {
          name: 'Account Created',
          value: user.createdAt.toDateString(),
          inline: true,
        },
      )
      .setTimestamp();

    message.reply({ embeds: [userInfoEmbed] });

    // Логирование команды
    logger.info(`\`${appConfig.commandStart}user\` command used by <@${message.author.id}> in <#${message.guild?.id}>`);
  },
};
