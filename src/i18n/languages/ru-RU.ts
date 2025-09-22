export default {
  common: {
    ok: "ОК",
    cancel: "Отмена",
    close: "Закрыть",
    save: "Сохранить",
    delete: "Удалить",
    edit: "Редактировать",
    copy: "Копировать",
    search: "Поиск",
    add: "Добавить",
    settings: "Настройки",
    exit: "Выход",
    confirm: "Подтвердить",
    loading: "Загрузка...",
    error: "Ошибка",
    success: "Успех",
    warning: "Предупреждение"
  },

  toolbar: {
    searchPlaceholder: "Поиск ключей API...",
    addApiKey: "Добавить ключ API",
    more: "Ещё",
    settings: "Настройки",
    exitApp: "Выйти из приложения",
    exitTooltip: "Выйти из приложения"
  },

  settings: {
    title: "Настройки",
    theme: "Тема",
    language: "Язык",
    shortcuts: "Горячие клавиши",
    about: "О приложении",
    
    themeOptions: {
      light: "Светлая",
      dark: "Тёмная",
      system: "Система"
    },

    shortcuts: {
      toggleToolbar: "Показать/Скрыть"
    },

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description: "Современный инструмент управления ключами API для безопасного хранения и управления ключами API разработчиками."
    }
  },

  apiKey: {
    name: "Имя",
    keyValue: "Ключ API",
    platform: "Платформа",
    description: "Описание",
    tags: "Теги",
    group: "Группа",
    createdAt: "Создан",
    updatedAt: "Обновлён",
    lastUsed: "Последнее использование",

    actions: {
      add: "Добавить ключ API",
      edit: "Редактировать",
      delete: "Удалить",
      copy: "Копировать",
      copySuccess: "Скопировано в буфер обмена",
      copyWarning: "Ключ API скопирован в буфер обмена. Пожалуйста, учитывайте риски безопасности. Система очистит буфер обмена через 30 секунд.",
      deleteConfirm: "Вы уверены, что хотите удалить?",
      deleteSuccess: "Ключ API удалён из системы",
      editSuccess: "Успешно обновлено"
    },

    form: {
      nameLabel: "Имя",
      namePlaceholder: "Введите имя ключа API",
      keyLabel: "Ключ API",
      keyPlaceholder: "Введите ключ API",
      platformLabel: "Платформа",
      platformPlaceholder: "Выберите платформу",
      descriptionLabel: "Описание",
      descriptionPlaceholder: "Введите описание (необязательно)",
      tagsLabel: "Теги",
      tagsPlaceholder: "Введите теги через запятую",
      submit: "Сохранить",
      cancel: "Отмена"
    }
  },

  search: {
    noResults: "Нет результатов",
    empty: "Результаты не найдены"
  },

  radialMenu: {
    loading: "Загрузка платформ..."
  },

  modal: {
    copySuccess: {
      title: "Копирование успешно",
      message: "Ключ API скопирован в буфер обмена. Пожалуйста, учитывайте риски безопасности. Система очистит буфер обмена через 30 секунд.",
      confirm: "ОК"
    },
    copyError: {
      title: "Ошибка копирования",
      message: "Не удалось скопировать ключ API в буфер обмена",
      close: "Закрыть"
    },
    editSuccess: {
      title: "Редактирование успешно",
      message: "Успешно обновлено",
      confirm: "ОК"
    },
    editError: {
      title: "Ошибка редактирования",
      message: "Не удалось обновить ключ API",
      close: "Закрыть"
    },
    deleteSuccess: {
      title: "Удаление успешно",
      message: "Ключ API удалён из системы",
      confirm: "ОК"
    },
    deleteError: {
      title: "Ошибка удаления",
      message: "Не удалось удалить ключ API",
      close: "Закрыть"
    },
    genericError: {
      title: "Ошибка",
      message: "Произошла неизвестная ошибка",
      close: "Закрыть"
    }
  },

  errors: {
    generic: "Произошла неизвестная ошибка",
    network: "Произошла сетевая ошибка",
    database: "Произошла ошибка базы данных",
    validation: "Произошла ошибка проверки",
    permission: "Доступ запрещён",
    notFound: "Ресурс не найден"
  }
};