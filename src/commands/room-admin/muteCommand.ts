import { Message, GuildMember, VoiceChannel, TextChannel } from 'discord.js';
import { ALLOWED_ROLES, MUTE_TIME } from '@config/roomAdminConfig';
import { appConfig } from '@config/config';
import { Command } from '@type/Command';
import { logger } from '@utils/logger';
import { formatDuration } from '@utils/formatDuration';

export const muteCommand: Command = {
  name: 'mute',
  description: 'Mutes a user in the voice channel for 5 minutes.',
  async execute(message: Message) {
    // Проверка прав
    const member = message.member as GuildMember;
    if (
      !member ||
      !member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.id))
    ) {
      await message.reply('You do not have permission to use this command.');
      logger.warn(
        `Unauthorized attempt to use \`${appConfig.commandStart}mute\` command by ${message.author.tag} in server **${message.guild?.name}**.`,
      );
      return;
    }

    const mentionedMember = message.mentions.members?.first();
    if (!mentionedMember) {
      await message.reply('Please mention a user to mute.');
      return;
    }

    const voiceChannel = member.voice.channel as VoiceChannel;
    if (!voiceChannel || voiceChannel.id !== mentionedMember.voice.channelId) {
      await message.reply(
        'You and the mentioned user must be in the same voice channel.',
      );
      return;
    }

    try {
      await mentionedMember.voice.setMute(true);
      await message.reply(
        `<@${mentionedMember.id}> has been muted for ${formatDuration(
          MUTE_TIME,
        )}.`,
      );

      // Логирование действия
      const logChannel = message.guild?.channels.cache.get(
        appConfig.moderatorLogChannelID,
      ) as TextChannel;
      if (logChannel) {
        await logChannel.send(
          `<@${appConfig.moderatorRoleID}> — \`${appConfig.tags.muteTag}\`: \`${
            appConfig.commandStart
          }mute\` command used by <@${message.author.id}> to mute <@${
            mentionedMember.id
          }> for${formatDuration(MUTE_TIME)} in <#${message.channel.id}>.`,
        );
      }

      logger.info(
        `User <@${message.author.id}> used \`${
          appConfig.commandStart
        }mute\` to mute <@${mentionedMember.user.id}> for ${formatDuration(
          MUTE_TIME,
        )} in server <#${message.guild?.id}>.`,
      );

      setTimeout(async () => {
        try {
          await mentionedMember.voice.setMute(false);
          await message.channel.send(
            `<@${mentionedMember.id}> has been unmuted after ${formatDuration(
              MUTE_TIME,
            )}.`,
          );

          logger.info(
            `User <@${
              mentionedMember.user.id
            }> was automatically unmuted after ${formatDuration(
              MUTE_TIME,
            )} in server <#>${message.guild?.name}>.`,
          );
        } catch (error) {
          logger.error(
            `Error occurred while unmuting <@${
              mentionedMember.user.id
            }> after ${formatDuration(MUTE_TIME)} in server <#>${
              message.guild?.id
            }>: ${error}`,
          );
        }
      }, MUTE_TIME);
    } catch (error) {
      await message.reply('There was an error muting the user.');
      logger.error(
        `Error occurred when <@${message.author.id}> attempted to mute <@${mentionedMember.user.id}> in server <#${message.guild?.name}>: ${error}`,
      );
    }
  },
};
