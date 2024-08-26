import { Message, GuildMember, VoiceChannel, TextChannel } from 'discord.js';
import { ALLOWED_ROLES } from '@config/roomAdminConfig';
import { appConfig } from '@config/config';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';

export const kickCommand: Command = {
  name: 'kick',
  description: 'Kicks a user from the voice channel.',
  async execute(message: Message) {
    // Проверка прав
    const member = message.member as GuildMember;
    if (
      !member ||
      !member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.id))
    ) {
      message.reply('You do not have permission to use this command.');
      logger.warn(
        `\`${appConfig.commandStart}kick\` command was attempted by <@${message.author.id}> without sufficient permissions in <#${message.guild?.id}>`,
      );
      return;
    }

    const mentionedMember = message.mentions.members?.first();
    if (!mentionedMember) {
      message.reply('Please mention a user to kick.');
      return;
    }

    const voiceChannel = member.voice.channel as VoiceChannel;
    if (!voiceChannel || voiceChannel.id !== mentionedMember.voice.channelId) {
      message.reply(
        'You and the mentioned user must be in the same voice channel.',
      );
      return;
    }

    try {
      await mentionedMember.voice.disconnect();
      message.reply(
        `<@${mentionedMember.id}> has been kicked from the voice channel.`,
      );

      const logChannel = message.guild?.channels.cache.get(
        appConfig.moderatorLogChannelID,
      ) as TextChannel;
      if (logChannel) {
        await logChannel.send(
          `<@${appConfig.moderatorRoleID}> — \`${appConfig.tags.kickTag}\`: \`${appConfig.commandStart}kick\` command used by <@${message.author.id}> to mute <@${mentionedMember.id}> in <#${message.channel.id}>`,
        );
      }

      // Логирование команды
      logger.info(
        `User <@${message.author.id}> used \`${appConfig.commandStart}kick\` command to kick <@${mentionedMember.id}> from voice channel <#${voiceChannel.id}> in guild <#${message.guild?.id}>.`,
      );
    } catch (error) {
      message.reply('There was an error kicking the user.');
      logger.error(
        `Error occurred while user <@${message.author.id}> tried to kick <@${mentionedMember.id}> from voice channel <#${voiceChannel.id}> in guild <#${message.guild?.id}>: ${error}`,
      );
    }
  },
};
