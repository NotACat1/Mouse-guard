import { Client, GatewayIntentBits, Events } from 'discord.js';
import { config } from 'dotenv';
import { onVoiceStateUpdate } from '@events/voiceStateUpdate';
import { onMessageCreate } from '@events/messageCreate';
import { ready } from '@events/ready';
import {
  //handleCommand,
  handleMessage,
} from '@commands/commandHandler';
import { logger } from '@utils/logger';

// Загружаем переменные окружения
config();

// Создаем экземпляр клиента Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, () => ready(client));

// Событие при запуске бота
client.once(Events.ClientReady, () => {
  logger.info(`Logged in as ${client.user?.tag}!`);
});

// Обработка новых сообщений
client.on(Events.MessageCreate, onMessageCreate);

// Обработка команд
client.on(Events.MessageCreate, handleMessage);

//// Обработка изменений голосовых состояний
client.on(Events.VoiceStateUpdate, onVoiceStateUpdate);

// Обработка ошибок
client.on(Events.Error, (error) => {
  logger.error(`Client encountered an error: ${error.message}`);
});

// Вход в Discord
client.login(process.env.BOT_TOKEN).catch((error) => {
  logger.error(`Failed to login: ${error.message}`);
});
