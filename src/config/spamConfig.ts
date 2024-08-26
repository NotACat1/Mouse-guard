export interface SpamProtectionConfig {
  protectedChannels: string[]; // Идентификаторы каналов, находящихся под защитой
  exemptUsers: string[]; // Идентификаторы пользователей, которые не попадают под защиту
  exemptRoles: string[]; // Идентификаторы ролей, исключенных из защиты
  maxMessages: number; // Максимальное количество сообщений
  timeWindow: number; // Окно времени в миллисекундах
  muteDuration: number; // Начальная продолжительность мута
  additionalMuteDuration: number; // Дополнительное время за повторное нарушение
  muteIncreaseInterval: number; // Интервал увеличения наказания в миллисекундах
  goodBehaviorWindow: number; // Окно времени для сброса наказания
  warningNotificationMessage: string; // Сообщение при предупреждении
  muteNotificationMessage: string; // Сообщение при мутации
}

export const spamProtectionConfig: SpamProtectionConfig = {
  protectedChannels: ['1277210117334630513'],
  exemptUsers: [''],
  exemptRoles: [''],
  maxMessages: 5,
  timeWindow: 10000,
  muteDuration: 60000,
  additionalMuteDuration: 30000, // Дополнительные 30 секунд
  muteIncreaseInterval: 60000, // Увеличение наказания каждые 60 секунд
  goodBehaviorWindow: 600000000, // Сброс наказания если нет нарушений в течение 60 секунд
  warningNotificationMessage:
    '**Внимание!** Мы заметили, что ваше поведение нарушает правила нашего сообщества. Пожалуйста, прекратите нарушение и соблюдайте установленные правила. В противном случае, вы можете получить мут. Спасибо за понимание.',
  muteNotificationMessage:
    '**Вы получили мут.** Ваше поведение нарушило правила нашего сообщества, поэтому на вас наложен мут на \`{duration}\`. Пожалуйста, изучите правила и соблюдайте их, чтобы избежать подобных ситуаций в будущем. Если у вас есть вопросы, обратитесь к модератору.',
};
