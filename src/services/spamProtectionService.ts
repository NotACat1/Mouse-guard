import { Message, GuildMember, TextChannel } from 'discord.js';
import { spamProtectionConfig } from '@config/spamConfig';
import { appConfig } from '@config/config';
import { logger } from '@utils/logger';
import { formatDuration } from '@utils/formatDuration';

interface UserMessageRecord {
  timestamp: number;
}

const userMessages: Map<string, UserMessageRecord[]> = new Map();
const userWarnings: Map<
  string,
  { warningSent: boolean; lastWarningTimestamp: number }
> = new Map();
const userPunishments: Map<
  string,
  { punishmentLevel: number; lastPunishmentTimestamp: number }
> = new Map();

export const handleSpamProtection = async (message: Message): Promise<void> => {
  const { author, guild, channel } = message;

  if (!guild) return;

  if (spamProtectionConfig.exemptUsers.includes(author.id)) return;
  const member = await guild.members.fetch(author.id);
  if (
    member.roles.cache.some((role) =>
      spamProtectionConfig.exemptRoles.includes(role.id),
    )
  ) return;
  if (!spamProtectionConfig.protectedChannels.includes(channel.id)) return;

  // Записываем сообщение пользователя
  const now = Date.now();
  const userRecord = userMessages.get(author.id) || [];
  userRecord.push({ timestamp: now });
  userMessages.set(author.id, userRecord);

  // Очищаем записи старше timeWindow
  const recentMessages = userRecord.filter(
    (record) => now - record.timestamp <= spamProtectionConfig.timeWindow,
  );
  userMessages.set(author.id, recentMessages);

  // Проверяем превышение лимита
  if (recentMessages.length > spamProtectionConfig.maxMessages) {
    const warning = userWarnings.get(author.id);
    const punishment = userPunishments.get(author.id) || {
      punishmentLevel: 0,
      lastPunishmentTimestamp: now,
    };

    if (
      now - punishment.lastPunishmentTimestamp >
      spamProtectionConfig.goodBehaviorWindow
    ) {
      punishment.punishmentLevel = 0; // Сбрасываем уровень наказания
    }

    if (!warning?.warningSent) {
      if (channel instanceof TextChannel) {
        await channel.send(
          `${author}, ${spamProtectionConfig.warningNotificationMessage}`,
        );
      }
      userWarnings.set(author.id, {
        warningSent: true,
        lastWarningTimestamp: now,
      });
      logger.info(`Warning sent to <@${author.id}> for spamming.`);
      return; // После отправки предупреждения прекращаем выполнение
    }

    // Увеличиваем уровень наказания
    punishment.punishmentLevel++;
    punishment.lastPunishmentTimestamp = now;
    userPunishments.set(author.id, punishment);

    // Рассчитываем время мута в зависимости от уровня наказания
    const muteDuration =
      spamProtectionConfig.muteDuration +
      (punishment.punishmentLevel - 1) *
        spamProtectionConfig.additionalMuteDuration;

    // Отправляем сообщение модераторам
    const logChannel = guild.channels.cache.get(
      appConfig.moderatorLogChannelID,
    ) as TextChannel;
    if (logChannel) {
      await logChannel.send(
        `<@&${appConfig.moderatorRoleID}> — \`${
          appConfig.tags.muteTag
        }\`: User <@${author.id}> has been muted for ${formatDuration(
          muteDuration,
        )} due to continued spamming.`,
      );
    }

    // Отправляем сообщение пользователю
    if (channel instanceof TextChannel) {
      await channel.send(
        `${author}, ${spamProtectionConfig.muteNotificationMessage.replace(
          '{duration}',
          formatDuration(muteDuration).toString(),
        )}`,
      );
    }

    // Мутим пользователя
    await muteUser(member, muteDuration);
  }
};

const muteUser = async (
  member: GuildMember,
  duration: number,
): Promise<void> => {
  try {
    await member.timeout(duration, 'Спам-защита');
    logger.info(
      `User <@${member.user.id}> has been muted for ${formatDuration(
        duration,
      )}.`,
    );

    // Логирование мута в канале
    const logChannel = member.guild.channels.cache.get(
      appConfig.moderatorLogChannelID,
    ) as TextChannel;
    if (logChannel) {
      await logChannel.send(
        `<@${appConfig.moderatorRoleID}> — \`${
          appConfig.tags.muteTag
        }\`: User <@${member.user.id}> has been muted for ${formatDuration(
          duration,
        )} due to spamming.`,
      );
    }
  } catch (error) {
    logger.error(`Failed to mute user <@${member.user.id}>: ${error}`);
  }
};
