# Mouse Guard

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

Этот проект представляет собой многофункционального Discord бота, написанного на TypeScript с использованием библиотеки `discord.js`. Бот включает различные команды для управления голосовыми каналами, администрирования пользователей, а также предоставляет базовые команды для взаимодействия с пользователями.

## Содержание

- [Mouse Guard](#mouse-guard)
  - [Содержание](#содержание)
  - [Требования](#требования)
  - [Установка](#установка)
  - [Настройка](#настройка)
  - [Конфигурация](#конфигурация)
    - [1. `config.ts`](#1-configts)
    - [2. `rolesConfig.ts`](#2-rolesconfigts)
    - [3. `roomAdminConfig.ts`](#3-roomadminconfigts)
    - [4. `spamConfig.ts`](#4-spamconfigts)
    - [5. `voiceChannelConfig.ts`](#5-voicechannelconfigts)
  - [Запуск](#запуск)
  - [Команды](#команды)
  - [Логирование](#логирование)
  - [Используемые технологии](#используемые-технологии)
  - [Вклад](#вклад)

## Требования

Для запуска проекта вам потребуется:

- [Node.js](https://nodejs.org/en/download/package-manager) (версии 16.x или выше)
- npm (версии 7.x или выше)
- [Discord Bot Token](https://discord.com/developers/applications/)

## Установка

1. **Клонирование репозитория**:

   ```bash
   git clone https://github.com/NotACat1/Mouse-guard.git
   cd Mouse-guard
   ```

2. **Установка зависимостей**:

   ```bash
   npm install
   ```

## Настройка

**Создание конфигурационного файла**: Создайте файл `.env` в корне проекта и добавьте следующие переменные:

```env
DISCORD_TOKEN=your-discord-bot-token
```

## Конфигурация

Проект использует несколько конфигурационных файлов для управления различными аспектами поведения бота:

### 1. `config.ts`

Файл `config.ts` определяет основные настройки приложения, такие как параметры команд и теги для сообщений.

```typescript
export interface AppConfig {
  moderatorLogChannelID: string; // Идентификатор канала для логирования действий модераторов
  moderatorRoleID: string; // Идентификатор роли модератора
  tags: {
    muteTag: string; // Тег для сообщений, связанных с мутом
    kickTag: string; // Тег для информационных сообщений
  };
  commandStart: string; // Префикс для всех команд
}
```

### 2. `rolesConfig.ts`

Этот файл содержит конфигурацию ролей, связанных с управлением комнатами на сервере.

```typescript
export interface RolesConfig {
  roomAdminRoleId: string; // ID роли администратора комнаты
  roomAdminRoleName: string; // Имя роли администратора комнаты
}
```

### 3. `roomAdminConfig.ts`

Конфигурация для ролей администраторов комнат и других параметров, связанных с управлением голосовыми каналами.

```typescript
import { rolesConfig } from '@config/rolesConfig';

export const ALLOWED_ROLES = [rolesConfig.roomAdminRoleId]; // Роли, которым разрешено использовать команды управления комнатой
export const MUTE_TIME = 5 * 60 * 1000; // Время мута пользователя (5 минут)
```

### 4. `spamConfig.ts`

Конфигурация для защиты от спама. Определяет параметры защиты каналов, исключения для пользователей и ролей, а также настройки наказаний за спам.

```typescript
export interface SpamProtectionConfig {
  protectedChannels: string[]; // Идентификаторы каналов, находящихся под защитой
  exemptUsers: string[]; // Идентификаторы пользователей, исключенных из защиты
  exemptRoles: string[]; // Идентификаторы ролей, исключенных из защиты
  maxMessages: number; // Максимальное количество сообщений за указанный период времени
  timeWindow: number; // Временное окно в миллисекундах для проверки спама
  muteDuration: number; // Начальная продолжительность мута
  additionalMuteDuration: number; // Дополнительное время за повторное нарушение
  muteIncreaseInterval: number; // Интервал увеличения наказания в миллисекундах
  goodBehaviorWindow: number; // Временное окно для сброса наказания при хорошем поведении
  warningNotificationMessage: string; // Сообщение при предупреждении о спаме
  muteNotificationMessage: string; // Сообщение при мутации за спам
}
```

### 5. `voiceChannelConfig.ts`

Конфигурация для управления голосовыми каналами, включает в себя настройки для отслеживания каналов и форматирования их названий.

```typescript
export interface VoiceChannelConfig {
  monitoredChannels: string[]; // Идентификаторы отслеживаемых голосовых каналов
  channelNameFormat: (guildName: string, userName: string) => string; // Функция форматирования названий каналов
}

export const voiceChannelConfig: VoiceChannelConfig = {
  monitoredChannels: ['1277398973010804777'], // Пример идентификатора канала
  channelNameFormat: (guildName: string, userName: string): string =>
    `${guildName} | ${userName}`, // Пример функции форматирования названий каналов
};
```

## Запуск

```bash
npm run start
```

## Команды

Бот поддерживает множество команд. Ниже перечислены основные команды:

- **!mute @user** — Мутирует пользователя на время в голосовом канале.
- **!kick @user** — Кикает пользователя из сервера.
- **!ban @user** — Банит пользователя на сервере.
- **!setlimit <number>** — Устанавливает лимит пользователей в текущем голосовом канале.
- **!rename <new-name>** — Переименовывает текущий голосовой канал.
- **!closeroom** — Закрывает текущий голосовой канал для всех пользователей.
- **!unlockroom** — Открывает голосовой канал для всех пользователей.
- **!status** — Отображает статус и информацию о текущем сервере.
- **!info** — Отображает информацию о сервере.
- **!userinfo** — Отображает информацию о пользователе.
- **!hello** — Приветствует пользователя, отправившего сообщение.
- **!ping** — Проверяет время отклика бота.
- **!helper** — Отображает список доступных команд.

> **Важно**: Команды управления каналами и пользователями доступны только для ролей, указанных в `ALLOWED_ROLES`.

## Логирование

Бот использует `winston` для логирования действий:

- Логи выводятся в консоль и сохраняются в файл `logs/app.log`.
- Вся информация о командах, попытках использования, ошибках и других действиях логируется.

Пример использования логера:

```typescript
logger.info('This is an informational message.');
logger.warn('This is a warning message.');
logger.error('This is an error message.');
```

## Используемые технологии

- **Node.js** — Серверная среда выполнения.
- **TypeScript** — Надстройка над JavaScript, добавляющая статическую типизацию.
- **discord.js** — Библиотека для взаимодействия с Discord API.
- **winston** — Логирование.

## Вклад

Ваши вклады приветствуются! Если вы хотите внести свой вклад в проект, пожалуйста, создайте форк репозитория и отправьте пулреквест.

1. Форкните репозиторий.
2. Создайте новую ветку для вашей функции (`git checkout -b feature/new-feature`).
3. Выполните коммиты ваших изменений (`git commit -m 'Add some feature'`).
4. Запушьте изменения в ветку (`git push origin feature/new-feature`).
5. Откройте пулреквест.
