import { Guild, GuildMember, VoiceChannel } from 'discord.js';

import { rolesConfig } from '@config/rolesConfig';

import { channelAdminRoles } from './channelService';

export const ensureRoomAdminRole = async (guild: Guild) => {
  let role = guild.roles.cache.find(
    (role) => role.name === rolesConfig.roomAdminRoleName,
  );

  if (!role) {
    role = await guild.roles.create({
      name: rolesConfig.roomAdminRoleName,
      mentionable: true,
    });
  }

  return role;
};

export const assignNewRoomAdmin = async (
  channel: VoiceChannel,
): Promise<GuildMember | null> => {
  const members = Array.from(channel.members.values());
  if (members.length === 0) return null;

  const newAdmin = members[Math.floor(Math.random() * members.length)];
  const roomAdminRole = await ensureRoomAdminRole(channel.guild);

  await newAdmin.roles.add(roomAdminRole);

  // Удаляем роль у предыдущего администратора
  const previousAdminId = channelAdminRoles.get(channel.id);
  if (previousAdminId) {
    const previousAdmin = channel.guild.members.cache.get(previousAdminId);
    if (previousAdmin) {
      await previousAdmin.roles.remove(roomAdminRole);
    }
  }

  // Обновляем информацию о новом администраторе
  channelAdminRoles.set(channel.id, newAdmin.id);

  return newAdmin;
};
