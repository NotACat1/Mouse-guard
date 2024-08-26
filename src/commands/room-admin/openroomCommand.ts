import { Message, GuildMember, VoiceChannel } from 'discord.js';
import { ALLOWED_ROLES } from '@config/roomAdminConfig';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const openRoomCommand: Command = {
  name: 'openroom',
  description: 'Opens the voice channel for all users.',
  async execute(message: Message) {
    // Проверка прав
    const member = message.member as GuildMember;
    if (
      !member ||
      !member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.id))
    ) {
      message.reply('You do not have permission to use this command.');
      logger.warn(
        `\`${appConfig.commandStart}openroom\` command was attempted by <@${message.author.id}> without sufficient permissions in <#${message.guild?.id}>`,
      );
      return;
    }

    const voiceChannel = member.voice.channel as VoiceChannel;
    if (!voiceChannel) {
      message.reply('You must be in a voice channel to use this command.');
      return;
    }

    try {
      await voiceChannel.permissionOverwrites.edit(
        message.guild!.roles.everyone,
        {
          Connect: true,
        },
      );
      message.reply(
        `Voice channel <#${voiceChannel.id}> is now open for everyone.`,
      );

      // Логирование команды
      logger.info(
        `User \`${message.author.tag}\` opened voice channel <#${voiceChannel.id}> for everyone in server <#${message.guild?.name}>.`,
      );
    } catch (error) {
      message.reply('There was an error opening the voice channel.');
      logger.error(
        `Error occurred while user <@${message.author.id}> tried to open voice channel <#${voiceChannel.id}> in server <#${message.guild?.name}>: ${error}`,
      );
    }
  },
};
