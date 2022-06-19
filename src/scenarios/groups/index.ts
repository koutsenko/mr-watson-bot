/**
 * Сценарий: категории чатов и групп
 * Пользователь: koutsenko
 */
import { wrapOwner } from '../../modules/bot';
import { appState } from '../../state';
import { IContext } from '../../types/bot';

/**
 * Инициализация периодических задач и обработчиков сообщений пользователя.
 */
export const init = (): void => {
  // Добавление реакции, пока эхо.
  appState.bot_module.on(
    'message',
    wrapOwner((ctx: IContext) => {
      const window = 50;
      appState.human_module.listSelfChats(window).then(async (result) => {
        const pages = [result];
        const count = result.count;
        const request_count = Math.ceil(count / window);
        // Дозапросим по необходимости остальные страницы.
        if (request_count > 1) {
          for (let i = 1; i < request_count; i++) {
            const page = await appState.human_module.listSelfChats(window, i * window);
            pages.push(page);
          }
        }

        let dialogs_ids = [];
        let groups_and_channels = [];

        for (const page of pages) {
          const dialogs = page.dialogs.filter((dialog) => dialog.peer._ === 'peerUser');

          dialogs_ids.push(...dialogs.map((dialog) => dialog.peer.user_id));
          groups_and_channels.push(...page.chats.map((chat) => chat.title));
        }

        // Удаляем дубликаты. Фича с array = [...new Set(array)] пока не компилируется.
        dialogs_ids = dialogs_ids.filter(function (item, pos, self) {
          return self.indexOf(item) == pos;
        });
        groups_and_channels = groups_and_channels.filter(function (item, pos, self) {
          return self.indexOf(item) == pos;
        });

        ctx.reply(`${request_count} страниц запросов`);
        ctx.reply(`Диалоги: ${JSON.stringify(dialogs_ids)}`);
        ctx.reply(`Группы и каналы: ${JSON.stringify(groups_and_channels)}`);
      });
    })
  );
};
