import { Message } from 'discord.js';
import { Command } from '@type/Command';
import { commands as commandsMessage } from './commandHandler';
import { logger } from '@utils/logger';
import { appConfig } from '@config/config';

export const helperCommand: Command = {
  name: 'helper',
  description: 'Displays a list of available commands.',
  async execute(message: Message) {
    const commands: Command[] = [...commandsMessage];

    const commandList = commands
      .map((cmd) => `**!${cmd.name}**: ${cmd.description}`)
      .join('\n');
    message.reply(`Here are the available commands:\n\n${commandList}`);

    // Логирование команды
    logger.info(`\`${appConfig.commandStart}helper\` command used by <@${message.author.id}> in <#${message.guild?.id}>`);
  },
};
