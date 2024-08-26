import { Message } from 'discord.js';
import { Command } from '@type/Command';
import { appConfig } from '@config/config';
import {
  avatarCommand,
  serverInfoCommand,
  statusCommand,
  userCommand,
} from './info/index';
import {
  closeRoomCommand,
  kickCommand,
  muteCommand,
  openRoomCommand,
  renameRoomCommand,
  setLimitCommand,
} from './room-admin/index';
import { helloCommand, pingCommand } from './utils/index';
import { helperCommand } from './helper';

export const commands: Command[] = [
  avatarCommand,
  serverInfoCommand,
  statusCommand,
  userCommand,
  closeRoomCommand,
  kickCommand,
  muteCommand,
  openRoomCommand,
  renameRoomCommand,
  setLimitCommand,
  helloCommand,
  pingCommand,
  helperCommand,
];

export function handleMessage(message: Message) {
  if (message.author.bot) return;

  const command = commands.find((cmd) =>
    message.content.startsWith(`${appConfig.commandStart}${cmd.name}`),
  );
  if (command) {
    command.execute(message);
  }
}
