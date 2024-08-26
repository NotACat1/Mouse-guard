export interface AppConfig {
  moderatorLogChannelID: string;
  moderatorRoleID: string;
  tags: {
    muteTag: string; // Тег для сообщений, связанных с мутом
    kickTag: string; // Тег для информационных сообщений
  };
  commandStart: string;
}

export const appConfig: AppConfig = {
  moderatorLogChannelID: '1277229243222331514',
  moderatorRoleID: '1277298941070671966',
  tags: {
    muteTag: '[MUTE]',
    kickTag: '[KICK]',
  },
  commandStart: '!',
};
