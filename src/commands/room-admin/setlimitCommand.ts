import { Message, GuildMember, VoiceChannel } from 'discord.js';
import { ALLOWED_ROLES } from '@config/roomAdminConfig';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const setLimitCommand: Command = {
  name: 'setlimit',
  description: 'Sets the user limit for the voice channel.',
  async execute(message: Message) {
    // Проверка прав
    const member = message.member as GuildMember;
    if (
      !member ||
      !member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.id))
    ) {
      message.reply('You do not have permission to use this command.');
      logger.warn(
        `\`${appConfig.commandStart}setlimit\` command was attempted by <@${message.author.id}> without sufficient permissions in <#${message.guild?.id}>`,
      );
      return;
    }

    const voiceChannel = member.voice.channel as VoiceChannel;
    if (!voiceChannel) {
      message.reply('You must be in a voice channel to use this command.');
      return;
    }

    const args = message.content.split(' ').slice(1);
    const userLimit = parseInt(args[0], 10);

    if (isNaN(userLimit) || userLimit < 1 || userLimit > 99) {
      message.reply('Please provide a valid user limit (1-99).');
      return;
    }

    try {
      await voiceChannel.setUserLimit(userLimit);
      message.channel.send(
        `User limit for <#${voiceChannel.id}> is now set to ${userLimit}.`,
      );

      // Логирование команды
      logger.info(
        `User <@${message.author.id}> set user limit of \`${userLimit}\` for voice channel <#${voiceChannel.id}> in server <#${message.guild?.id}>.`,
      );
    } catch (error) {
      message.reply('There was an error setting the user limit.');
      logger.error(
        `Error occurred while user <@${message.author.id}> tried to set user limit for voice channel <#${voiceChannel.id}> in server <#${message.guild?.id}>: ${error}`,
      );
    }
  },
};
