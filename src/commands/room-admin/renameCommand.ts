import { Message, GuildMember, VoiceChannel } from 'discord.js';
import { ALLOWED_ROLES } from '@config/roomAdminConfig';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const renameRoomCommand: Command = {
  name: 'rename',
  description: 'Renames the voice channel.',
  async execute(message: Message) {
    // Проверка прав
    const member = message.member as GuildMember;
    if (
      !member ||
      !member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.id))
    ) {
      message.reply('You do not have permission to use this command.');
      logger.warn(
        `\`${appConfig.commandStart}rename\` command was attempted by <@${message.author.id}> without sufficient permissions in <#${message.guild?.id}>`,
      );
      return;
    }

    const voiceChannel = member.voice.channel as VoiceChannel;
    if (!voiceChannel) {
      message.reply('You must be in a voice channel to use this command.');
      return;
    }

    const args = message.content.split(' ').slice(1);
    const newName = args.join(' ');

    if (!newName) {
      message.reply('Please provide a new name for the voice channel.');
      return;
    }

    try {
      await voiceChannel.setName(newName);
      message.reply(`Voice channel has been renamed to **${newName}**.`);

      // Логирование команды
      logger.info(
        `User <@${message.author.id}> renamed voice channel from <#${voiceChannel.id}> to **${newName}** in server <#${message.guild?.id}>.`
      );
    } catch (error) {
      message.reply('There was an error renaming the voice channel.');
      logger.error(
        `Error occurred while user <@${message.author.id}> tried to rename voice channel from <#${voiceChannel.id}> to **${newName}** in server <#${message.guild?.id}>: ${error}`
      );
    }
  },
};
