export default {
  common: {
    ok: "確定",
    cancel: "取消",
    close: "關閉",
    save: "儲存",
    delete: "刪除",
    edit: "編輯",
    copy: "複製",
    search: "搜尋",
    add: "新增",
    settings: "設定",
    exit: "退出",
    confirm: "確認",
    loading: "載入中...",
    error: "錯誤",
    success: "成功",
    warning: "警告",
  },

  floatingToolbar: {
    searchPlaceholder: "搜尋API金鑰...",
    addApiKey: "新增API金鑰",
    more: "更多",
    settings: "設定",
    exit: "退出應用程式",
    loadingPlatforms: "載入平台中...",
  },

  settings: {
    title: "設定",
    theme: "顏色主題",
    language: "語言",
    shortcuts: "快速鍵",
    aboutTitle: "關於",

    themeOptions: {
      light: "淺色",
      dark: "深色",
      system: "系統",
    },

    shortcutsToggle: "呼叫/隱藏",

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description:
        "一個現代化的API金鑰管理工具，協助開發者安全地儲存和管理API金鑰。",
    },
  },

  apiKey: {
    name: "名稱",
    keyValue: "API金鑰",
    platform: "平台",
    description: "描述",
    tags: "標籤",
    group: "群組",
    createdAt: "建立時間",
    updatedAt: "更新時間",
    lastUsed: "最後使用",

    actions: {
      add: "新增API金鑰",
      edit: "編輯",
      delete: "刪除",
      copy: "複製",
      copySuccess: "已複製到剪貼簿",
      copyWarning:
        "API金鑰已複製到剪貼簿，請注意風險。系統將在30秒後自動清空剪貼簿。",
      deleteConfirm: "確定要刪除嗎？",
      deleteSuccess: "API金鑰已從系統中移除",
      editSuccess: "更新成功",
    },

    form: {
      nameLabel: "名稱",
      namePlaceholder: "輸入API金鑰名稱",
      keyLabel: "API金鑰",
      keyPlaceholder: "輸入API金鑰",
      platformLabel: "平台",
      platformPlaceholder: "選擇平台",
      descriptionLabel: "描述",
      descriptionPlaceholder: "輸入描述（可選）",
      tagsLabel: "標籤",
      tagsPlaceholder: "輸入標籤，用逗號分隔",
      submit: "儲存",
      cancel: "取消",
    },
  },

  searchResults: {
    noResults: "暫無結果",
    namePlaceholder: "名稱",
    keyPlaceholder: "API金鑰",
    save: "儲存",
    cancel: "取消",
    confirmDelete: "確定要刪除嗎？",
    confirm: "確認",
    edit: "編輯",
    delete: "刪除",
    copy: "複製",
    copySuccess: "複製成功",
    copySuccessMessage:
      "API金鑰已複製到剪貼簿，請注意風險。系統將在30秒後自動清空剪貼簿。",
    copyFailed: "複製失敗",
    copyFailedMessage: "無法將API金鑰複製到剪貼簿",
    editSuccess: "編輯成功",
    editSuccessMessage: "{{name}}更新成功",
    editFailed: "編輯失敗",
    editFailedMessage: "無法更新API金鑰",
    deleteSuccess: "刪除成功",
    deleteSuccessMessage: "API金鑰已從系統中移除",
    deleteFailed: "刪除失敗",
    deleteFailedMessage: "無法刪除API金鑰",
    unknownError: "發生未知錯誤",
    close: "關閉",
  },

  radialMenu: {
    loading: "載入平台中...",
  },

  modal: {
    copySuccess: {
      title: "複製成功",
      message:
        "API金鑰已複製到剪貼簿，請注意風險。系統將在30秒後自動清空剪貼簿。",
      confirm: "確定",
    },
    copyError: {
      title: "複製失敗",
      message: "無法將API金鑰複製到剪貼簿",
      close: "關閉",
    },
    editSuccess: {
      title: "編輯成功",
      message: "更新成功",
      confirm: "確定",
    },
    editError: {
      title: "編輯失敗",
      message: "無法更新API金鑰",
      close: "關閉",
    },
    deleteSuccess: {
      title: "刪除成功",
      message: "API金鑰已從系統中移除",
      confirm: "確定",
    },
    deleteError: {
      title: "刪除失敗",
      message: "無法刪除API金鑰",
      close: "關閉",
    },
    genericError: {
      title: "錯誤",
      message: "發生未知錯誤",
      close: "關閉",
    },
  },

  errors: {
    generic: "發生未知錯誤",
    network: "發生網路錯誤",
    database: "發生資料庫錯誤",
    validation: "發生驗證錯誤",
    permission: "權限被拒絕",
    notFound: "資源未找到",
  },

  addApiKeyDialog: {
    title: "新增API金鑰",
    batchImport: "批次匯入",
    batchImportInstructions:
      "使用Excel模板批次匯入API金鑰。請先下載模板，填寫資料後上傳。",
    downloadTemplate: "下載模板",
    selectExcelFile: "選擇Excel檔案",
    supportedFormats: "支援的格式：Excel檔案 (.xlsx)",
    requiredColumns: "需包含欄位：名稱 | API金鑰 | 平台 | 描述",
    savedToDownloads: "已儲存到下載資料夾",
    openFile: "開啟檔案",
    back: "返回",
    submitting: "提交中…",

    form: {
      nameLabel: "名稱",
      namePlaceholder: "請輸入API金鑰名稱",
      keyLabel: "API金鑰",
      keyPlaceholder: "請輸入API金鑰",
      platformLabel: "平台",
      platformPlaceholder: "如：OpenAI、Claude、Gemini...",
      descriptionLabel: "描述",
      descriptionPlaceholder: "可選描述資訊...",
    },

    errors: {
      nameRequired: "名稱不能為空",
      keyRequired: "API金鑰不能為空",
      keyInvalid: "API金鑰格式無效",
    },

    previewNotAvailable: "預覽功能不可用",
    previewNotAvailableMessage: "請在桌面環境中使用預覽功能",
    previewWindowError: "預覽視窗錯誤",
    error: "錯誤",

    importSuccess: "匯入成功",
    importSuccessMessage:
      "成功匯入 {{succeeded}} 個API金鑰，失敗 {{failed}} 個",
    importFailed: "匯入失敗",
    importFailedMessage: "匯入過程中發生錯誤",
    importProcessError: "匯入處理過程中發生錯誤",

    addSuccess: "新增成功",
    addSuccessMessage: "{{name}} 新增成功",
    addFailed: "新增失敗",
    addFailedMessage: "新增過程中發生錯誤",

    fileFormatError: "檔案格式錯誤",
    fileFormatErrorMessage: "請選擇Excel檔案(.xlsx或.xls)",
    excelParseError: "Excel解析失敗",
    cannotParseExcelFile: "無法解析Excel檔案",
    parseProcessError: "解析過程中發生錯誤",

    tauriPluginNotInitialized: "Tauri外掛未初始化",
    tauriEnvironmentRequired: "請確保在Tauri桌面環境中執行",
    fileSelectionFailed: "檔案選擇失敗",
    cannotOpenFileDialog: "無法開啟檔案對話框",
    downloadFailed: "下載失敗",
    downloadProcessError: "模板下載過程中發生錯誤",
    openFileFailed: "開啟檔案失敗",
    cannotOpenDownloadedFile: "無法開啟下載的檔案",

    templateDownloadSuccess: "模板下載成功",
    downloadedToBrowser: "檔案已下載到瀏覽器預設下載位置",
    templateSavedMessage: 'Excel模板檔案 "{{fileName}}" 已儲存到您的下載資料夾',

    info: "提示",
    fileSavedTo: "檔案已儲存到: {{filePath}}",
  },

  themeToggle: {
    lightTheme: "淺色主題",
    switchToLight: "切換到淺色主題",
    darkTheme: "深色主題",
    switchToDark: "切換到深色主題",
    systemTheme: "系統主題",
    followSystem: "跟隨系統主題",
    system: "系統",
    dark: "深色",
    light: "淺色",
  },
};
