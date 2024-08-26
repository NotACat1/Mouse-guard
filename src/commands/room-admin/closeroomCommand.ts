import { Message, GuildMember, VoiceChannel } from 'discord.js';
import { ALLOWED_ROLES } from '@config/roomAdminConfig';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const closeRoomCommand: Command = {
  name: 'closeroom',
  description: 'Closes the voice channel for all users.',
  async execute(message: Message) {
    // Проверка прав
    const member = message.member as GuildMember;
    if (
      !member ||
      !member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.id))
    ) {
      message.reply('You do not have permission to use this command.');
      logger.warn(
        `\`${appConfig.commandStart}closeroom\` command was attempted by <@${message.author.id}> without sufficient permissions in <#${message.guild?.id}>`,
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
          Connect: false,
        },
      );
      message.reply(
        `Voice channel <#${voiceChannel.id}> is now closed for everyone.`,
      );

      // Логирование команды
      logger.info(
        `User <@${message.author.id}> executed \`${appConfig.commandStart}closeroom\` command, closing voice channel <#${voiceChannel.id}> in server <#${message.guild?.id}>.`,
      );
    } catch (error) {
      message.reply('There was an error closing the voice channel.');
      logger.error(
        `Error during \`${appConfig.commandStart}closeroom\` command execution by <@${message.author.id}> in server <#${message.guild?.id}>. Error details: ${error}`,
      );
    }
  },
};
