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
    warning: "警告"
  },

  toolbar: {
    searchPlaceholder: "搜尋API金鑰...",
    addApiKey: "新增API金鑰",
    more: "更多",
    settings: "設定",
    exitApp: "退出應用程式",
    exitTooltip: "退出應用程式"
  },

  settings: {
    title: "設定",
    theme: "顏色主題",
    language: "語言",
    shortcuts: "快速鍵",
    about: "關於",
    
    themeOptions: {
      light: "淺色",
      dark: "深色",
      system: "系統"
    },

    shortcuts: {
      toggleToolbar: "呼叫/隱藏"
    },

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description: "一個現代化的API金鑰管理工具，協助開發者安全地儲存和管理API金鑰。"
    }
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
      copyWarning: "API金鑰已複製到剪貼簿，請注意風險。系統將在30秒後自動清空剪貼簿。",
      deleteConfirm: "確定要刪除嗎？",
      deleteSuccess: "API金鑰已從系統中移除",
      editSuccess: "更新成功"
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
      cancel: "取消"
    }
  },

  search: {
    noResults: "暫無結果",
    empty: "未找到結果"
  },

  radialMenu: {
    loading: "載入平台中..."
  },

  modal: {
    copySuccess: {
      title: "複製成功",
      message: "API金鑰已複製到剪貼簿，請注意風險。系統將在30秒後自動清空剪貼簿。",
      confirm: "確定"
    },
    copyError: {
      title: "複製失敗",
      message: "無法將API金鑰複製到剪貼簿",
      close: "關閉"
    },
    editSuccess: {
      title: "編輯成功",
      message: "更新成功",
      confirm: "確定"
    },
    editError: {
      title: "編輯失敗",
      message: "無法更新API金鑰",
      close: "關閉"
    },
    deleteSuccess: {
      title: "刪除成功",
      message: "API金鑰已從系統中移除",
      confirm: "確定"
    },
    deleteError: {
      title: "刪除失敗",
      message: "無法刪除API金鑰",
      close: "關閉"
    },
    genericError: {
      title: "錯誤",
      message: "發生未知錯誤",
      close: "關閉"
    }
  },

  errors: {
    generic: "發生未知錯誤",
    network: "發生網路錯誤",
    database: "發生資料庫錯誤",
    validation: "發生驗證錯誤",
    permission: "權限被拒絕",
    notFound: "資源未找到"
  }
};