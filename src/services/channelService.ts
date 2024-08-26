import {
  Collection,
  Guild,
  GuildMember,
  VoiceChannel,
  ChannelType,
  CategoryChannel
} from 'discord.js';
import { logger } from '@utils/logger';
import { rolesConfig } from '@config/rolesConfig';
import { voiceChannelConfig } from '@config/voiceChannelConfig';

// Хранение текущих администраторов каналов
export const channelAdminRoles = new Collection<string, string>(); // channelId -> memberId

// Функция для создания новой голосовой комнаты
export const createVoiceChannelForUser = async (
  guild: Guild,
  member: GuildMember,
  category: CategoryChannel,
): Promise<VoiceChannel | null> => {
  try {
    const channelName = voiceChannelConfig.channelNameFormat(
      category.name || 'Room',
      member.user.username,
    );
    const newVoiceChannel = await guild.channels.create({
      name: channelName,
      parent: category.id,
      type: ChannelType.GuildVoice,
    });

    // Перемещение пользователя в новый голосовой канал
    await member.voice.setChannel(newVoiceChannel);

    // Назначение администратора и переименование комнаты
    await assignNewRoomAdmin(newVoiceChannel);

    channelAdminRoles.set(newVoiceChannel.id, member.user.id);

    return newVoiceChannel;
  } catch (error) {
    logger.error(`Failed creating voice channel: ${error}`);
    return null;
  }
};

// Назначение нового администратора комнаты
export const assignNewRoomAdmin = async (
  channel: VoiceChannel,
): Promise<GuildMember | null> => {
  const members = Array.from(channel.members.values());
  if (members.length === 0) return null;

  // Случайный выбор нового администратора
  const newAdmin = members[Math.floor(Math.random() * members.length)];
  const roleId = await ensureRoomAdminRole(channel.guild);

  await newAdmin.roles.add(roleId);

  // Удаляем роль у предыдущего администратора
  const previousAdminId = channelAdminRoles.get(channel.id);
  if (previousAdminId) {
    const previousAdmin = channel.guild.members.cache.get(previousAdminId);
    if (previousAdmin && previousAdmin.id !== newAdmin.id) {
      await previousAdmin.roles.remove(roleId);
    }
  }

  // Обновляем информацию о новом администраторе
  channelAdminRoles.set(channel.id, newAdmin.id);

  // Переименование канала в соответствии с новым администратором
  await channel.setName(voiceChannelConfig.channelNameFormat(
    channel.parent?.name || 'Room',
    newAdmin.user.username,
  ));

  return newAdmin;
};

// Обеспечение наличия роли администратора комнаты
export const ensureRoomAdminRole = async (guild: Guild): Promise<string> => {
  let role = guild.roles.cache.get(rolesConfig.roomAdminRoleId);

  // Если роли нет, создаем ее
  if (!role) {
    role = await guild.roles.create({
      name: rolesConfig.roomAdminRoleName,
      mentionable: true,
    });

    // Обновляем конфиг с новым ID роли
    rolesConfig.roomAdminRoleId = role.id;
  }

  return role.id;
};

// Снятие роли администратора, если он покидает комнату
export const removeRoomAdminRole = async (member: GuildMember) => {
  const roomAdminRoleId = rolesConfig.roomAdminRoleId;
  if (member.roles.cache.has(roomAdminRoleId)) {
    await member.roles.remove(roomAdminRoleId);
  }
};
