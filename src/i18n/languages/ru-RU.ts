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

  floatingToolbar: {
    searchPlaceholder: "Поиск ключей API...",
    addApiKey: "Добавить ключ API",
    more: "Ещё",
    settings: "Настройки",
    exit: "Выйти из приложения",
    loadingPlatforms: "Загрузка платформ..."
  },

  settings: {
    title: "Настройки",
    theme: "Тема",
    language: "Язык",
    shortcuts: "Горячие клавиши",
    aboutTitle: "О приложении",
    
    themeOptions: {
      light: "Светлая",
      dark: "Тёмная",
      system: "Система"
    },

    shortcutsToggle: "Показать/Скрыть",

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

  searchResults: {
    noResults: "Нет результатов",
    namePlaceholder: "Имя",
    keyPlaceholder: "Ключ API",
    save: "Сохранить",
    cancel: "Отмена",
    confirmDelete: "Вы уверены, что хотите удалить?",
    confirm: "Подтвердить",
    edit: "Редактировать",
    delete: "Удалить",
    copy: "Копировать",
    copySuccess: "Копирование успешно",
    copySuccessMessage: "Ключ API скопирован в буфер обмена. Пожалуйста, учитывайте риски безопасности. Система очистит буфер обмена через 30 секунд.",
    copyFailed: "Ошибка копирования",
    copyFailedMessage: "Не удалось скопировать ключ API в буфер обмена",
    editSuccess: "Редактирование успешно",
    editSuccessMessage: "{{name}} успешно обновлено",
    editFailed: "Ошибка редактирования",
    editFailedMessage: "Не удалось обновить ключ API",
    deleteSuccess: "Удаление успешно",
    deleteSuccessMessage: "Ключ API удалён из системы",
    deleteFailed: "Ошибка удаления",
    deleteFailedMessage: "Не удалось удалить ключ API",
    unknownError: "Произошла неизвестная ошибка",
    close: "Закрыть"
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
  },

  addApiKeyDialog: {
    title: "Добавить ключ API",
    batchImport: "Пакетный импорт",
    batchImportInstructions: "Используйте шаблон Excel для пакетного импорта ключей API. Пожалуйста, сначала скачайте шаблон, заполните данные, а затем загрузите.",
    downloadTemplate: "Скачать шаблон",
    selectExcelFile: "Выбрать файл Excel",
    supportedFormats: "Поддерживаемые форматы: файлы Excel (.xlsx)",
    requiredColumns: "Обязательные столбцы: Имя | Ключ API | Платформа | Описание",
    savedToDownloads: "Сохранено в папку загрузок",
    openFile: "Открыть файл",
    back: "Назад",
    submitting: "Отправка…",
    
    form: {
      nameLabel: "Имя",
      namePlaceholder: "Пожалуйста, введите имя ключа API",
      keyLabel: "Ключ API",
      keyPlaceholder: "Пожалуйста, введите ключ API",
      platformLabel: "Платформа",
      platformPlaceholder: "напр.: OpenAI, Claude, Gemini...",
      descriptionLabel: "Описание",
      descriptionPlaceholder: "Необязательное описание..."
    },

    errors: {
      nameRequired: "Имя обязательно",
      keyRequired: "Ключ API обязателен",
      keyInvalid: "Формат ключа API недействителен"
    },

    previewNotAvailable: "Предпросмотр недоступен",
    previewNotAvailableMessage: "Пожалуйста, используйте функцию предпросмотра в настольной среде",
    previewWindowError: "Ошибка окна предпросмотра",
    error: "Ошибка",
    
    importSuccess: "Импорт успешен",
    importSuccessMessage: "Успешно импортировано {{succeeded}} ключей API, {{failed}} с ошибками",
    importFailed: "Ошибка импорта",
    importFailedMessage: "Произошла ошибка во время импорта",
    importProcessError: "Произошла ошибка во время обработки импорта",

    addSuccess: "Добавление успешно",
    addSuccessMessage: "{{name}} успешно добавлен",
    addFailed: "Ошибка добавления",
    addFailedMessage: "Произошла ошибка во время добавления",

    fileFormatError: "Ошибка формата файла",
    fileFormatErrorMessage: "Пожалуйста, выберите файл Excel (.xlsx или .xls)",
    excelParseError: "Ошибка анализа Excel",
    cannotParseExcelFile: "Не удалось проанализировать файл Excel",
    parseProcessError: "Произошла ошибка во время анализа",

    tauriPluginNotInitialized: "Плагин Tauri не инициализирован",
    tauriEnvironmentRequired: "Пожалуйста, убедитесь, что вы работаете в настольной среде Tauri",
    fileSelectionFailed: "Ошибка выбора файла",
    cannotOpenFileDialog: "Не удалось открыть диалоговое окно файла",
    downloadFailed: "Ошибка скачивания",
    downloadProcessError: "Произошла ошибка во время скачивания шаблона",
    openFileFailed: "Ошибка открытия файла",
    cannotOpenDownloadedFile: "Не удалось открыть скачанный файл",
    
    templateDownloadSuccess: "Скачивание шаблона успешно",
    downloadedToBrowser: "Файл скачан в место скачивания по умолчанию браузера",
    templateSavedMessage: "Файл шаблона Excel \"{{fileName}}\" был сохранён в вашу папку загрузок",
    
    info: "Информация",
    fileSavedTo: "Файл сохранён в: {{filePath}}"
  },

  themeToggle: {
    lightTheme: "Светлая тема",
    switchToLight: "Переключить на светлую тему",
    darkTheme: "Тёмная тема",
    switchToDark: "Переключить на тёмную тему",
    systemTheme: "Системная тема",
    followSystem: "Следовать системной теме",
    system: "Система",
    dark: "Тёмная",
    light: "Светлая"
  }
};