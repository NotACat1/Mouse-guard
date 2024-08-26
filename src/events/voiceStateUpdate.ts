import { VoiceState, VoiceChannel } from 'discord.js';
import {
  assignNewRoomAdmin,
  removeRoomAdminRole,
} from '@services/roomAdminService';
import {
  channelAdminRoles,
  createVoiceChannelForUser,
} from '@services/channelService';
import { logger } from '@utils/logger';
import { voiceChannelConfig } from '@config/voiceChannelConfig';

export const onVoiceStateUpdate = async (
  oldState: VoiceState,
  newState: VoiceState,
): Promise<void> => {
  try {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const member = newState.member;

    if (!member || !newState.guild) return;

    if (oldChannel && newChannel) {
      if (
        oldChannel instanceof VoiceChannel &&
        channelAdminRoles.has(oldChannel.id)
      ) {
        if (oldChannel.members.size === 0) {
          await oldChannel.delete();
          channelAdminRoles.delete(oldChannel.id);
        } else {
          await assignNewRoomAdmin(oldChannel as VoiceChannel);
        }
      }

      await removeRoomAdminRole(member);

      if (voiceChannelConfig.monitoredChannels.includes(newChannel.id)) {
        const category = newChannel.parent;
        if (category) {
          await createVoiceChannelForUser(newState.guild, member, category);
        }
      }
    }

    if (oldChannel && !newChannel) {
      if (
        oldChannel instanceof VoiceChannel &&
        channelAdminRoles.has(oldChannel.id)
      ) {
        if (oldChannel.members.size === 0) {
          await oldChannel.delete();
          channelAdminRoles.delete(oldChannel.id);
        } else {
          await assignNewRoomAdmin(oldChannel as VoiceChannel);
        }
      }

      await removeRoomAdminRole(member);
    }

    if (newChannel && !oldChannel) {
      if (voiceChannelConfig.monitoredChannels.includes(newChannel.id)) {
        const category = newChannel.parent;
        if (category) {
          await createVoiceChannelForUser(newState.guild, member, category);
        }
      }
    }
  } catch (error) {
    logger.error(`Error handling voice state update: ${error}`);
  }
};
