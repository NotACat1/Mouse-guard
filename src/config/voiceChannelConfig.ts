export interface VoiceChannelConfig {
  monitoredChannels: string[];
  channelNameFormat: (guildName: string, userName: string) => string;
}

export const voiceChannelConfig: VoiceChannelConfig = {
  monitoredChannels: ['1277398973010804777'],
  channelNameFormat: (guildName: string, userName: string): string =>
    `${guildName} | ${userName}`,
};
