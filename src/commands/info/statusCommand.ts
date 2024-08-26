import { Message, EmbedBuilder } from 'discord.js';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const statusCommand: Command = {
  name: 'status',
  description: "Displays the bot's status with some fields.",
  async execute(message: Message) {
    const statusEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Bot Status')
      .addFields(
        {
          name: 'Uptime',
          value: `${process.uptime().toFixed(2)} seconds`,
          inline: true,
        },
        {
          name: 'Guilds',
          value: `${message.client.guilds.cache.size}`,
          inline: true,
        },
        {
          name: 'Users',
          value: `${message.client.users.cache.size}`,
          inline: true,
        },
      )
      .setTimestamp()
      .setFooter({ text: 'Status requested by ' + message.author.tag });

    message.reply({ embeds: [statusEmbed] });

    // Логирование команды
    logger.info(`\`${appConfig.commandStart}status\` command used by <@${message.author.id}> in <#${message.guild?.id}>`);
  },
};
