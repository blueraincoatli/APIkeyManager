export default {
  common: {
    ok: "确定",
    cancel: "取消",
    close: "关闭",
    save: "保存",
    delete: "删除",
    edit: "编辑",
    copy: "复制",
    search: "搜索",
    add: "添加",
    settings: "设置",
    exit: "退出",
    confirm: "确认",
    loading: "加载中...",
    error: "错误",
    success: "成功",
    warning: "警告",
  },

  floatingToolbar: {
    searchPlaceholder: "搜索API密钥...",
    addApiKey: "添加API密钥",
    more: "更多",
    settings: "设置",
    exit: "退出应用程序",
    loadingPlatforms: "加载平台中...",
  },

  settings: {
    title: "设置",
    theme: "颜色主题",
    language: "语言",
    shortcuts: "快捷键",
    aboutTitle: "关于",

    themeOptions: {
      light: "浅色",
      dark: "深色",
      system: "系统",
    },

    shortcutsToggle: "召唤/隐藏",

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description:
        "一个现代化的API密钥管理工具，帮助开发者安全地存储和管理API密钥。",
    },
  },

  apiKey: {
    name: "名称",
    keyValue: "API密钥",
    platform: "平台",
    description: "描述",
    tags: "标签",
    group: "分组",
    createdAt: "创建时间",
    updatedAt: "更新时间",
    lastUsed: "最后使用",

    actions: {
      add: "添加API密钥",
      edit: "编辑",
      delete: "删除",
      copy: "复制",
      copySuccess: "已复制到剪贴板",
      copyWarning:
        "API密钥已复制到剪贴板，请注意风险。系统将在30秒后自动清空剪贴板。",
      deleteConfirm: "确定要删除吗？",
      deleteSuccess: "API密钥已从系统中移除",
      editSuccess: "更新成功",
    },

    form: {
      nameLabel: "名称",
      namePlaceholder: "输入API密钥名称",
      keyLabel: "API密钥",
      keyPlaceholder: "输入API密钥",
      platformLabel: "平台",
      platformPlaceholder: "选择平台",
      descriptionLabel: "描述",
      descriptionPlaceholder: "输入描述（可选）",
      tagsLabel: "标签",
      tagsPlaceholder: "输入标签，用逗号分隔",
      submit: "保存",
      cancel: "取消",
    },
  },

  searchResults: {
    noResults: "暂无结果",
    namePlaceholder: "名称",
    keyPlaceholder: "API密钥",
    save: "保存",
    cancel: "取消",
    confirmDelete: "确定要删除吗？",
    confirm: "确认",
    edit: "编辑",
    delete: "删除",
    copy: "复制",
    copySuccess: "复制成功",
    copySuccessMessage:
      "API密钥已复制到剪贴板，请注意风险。系统将在30秒后自动清空剪贴板。",
    copyFailed: "复制失败",
    copyFailedMessage: "无法将API密钥复制到剪贴板",
    editSuccess: "编辑成功",
    editSuccessMessage: "{{name}}更新成功",
    editFailed: "编辑失败",
    editFailedMessage: "无法更新API密钥",
    deleteSuccess: "删除成功",
    deleteSuccessMessage: "API密钥已从系统中移除",
    deleteFailed: "删除失败",
    deleteFailedMessage: "无法删除API密钥",
    unknownError: "发生未知错误",
    close: "关闭",
  },

  radialMenu: {
    loading: "加载平台中...",
  },

  modal: {
    copySuccess: {
      title: "复制成功",
      message:
        "API密钥已复制到剪贴板，请注意风险。系统将在30秒后自动清空剪贴板。",
      confirm: "确定",
    },
    copyError: {
      title: "复制失败",
      message: "无法将API密钥复制到剪贴板",
      close: "关闭",
    },
    editSuccess: {
      title: "编辑成功",
      message: "更新成功",
      confirm: "确定",
    },
    editError: {
      title: "编辑失败",
      message: "无法更新API密钥",
      close: "关闭",
    },
    deleteSuccess: {
      title: "删除成功",
      message: "API密钥已从系统中移除",
      confirm: "确定",
    },
    deleteError: {
      title: "删除失败",
      message: "无法删除API密钥",
      close: "关闭",
    },
    genericError: {
      title: "错误",
      message: "发生未知错误",
      close: "关闭",
    },
  },

  errors: {
    generic: "发生未知错误",
    network: "发生网络错误",
    database: "发生数据库错误",
    validation: "发生验证错误",
    permission: "权限被拒绝",
    notFound: "资源未找到",
  },

  addApiKeyDialog: {
    title: "新增API密钥",
    batchImport: "批量导入",
    batchImportInstructions:
      "使用Excel模板批量导入API密钥。请先下载模板，填写数据后上传。",
    downloadTemplate: "下载模板",
    selectExcelFile: "选择Excel文件",
    supportedFormats: "支持的格式：Excel文件 (.xlsx)",
    requiredColumns: "需包含列：名称 | API密钥 | 平台 | 描述",
    savedToDownloads: "已保存到下载文件夹",
    openFile: "打开文件",
    back: "返回",
    submitting: "提交中…",

    form: {
      nameLabel: "名称",
      namePlaceholder: "请输入API密钥名称",
      keyLabel: "API密钥",
      keyPlaceholder: "请输入API密钥",
      platformLabel: "平台",
      platformPlaceholder: "如：OpenAI、Claude、Gemini...",
      descriptionLabel: "描述",
      descriptionPlaceholder: "可选描述信息...",
    },

    errors: {
      nameRequired: "名称不能为空",
      keyRequired: "API密钥不能为空",
      keyInvalid: "API密钥格式无效",
    },

    previewNotAvailable: "预览功能不可用",
    previewNotAvailableMessage: "请在桌面环境中使用预览功能",
    previewWindowError: "预览窗口错误",
    error: "错误",

    importSuccess: "导入成功",
    importSuccessMessage:
      "成功导入 {{succeeded}} 个API密钥，失败 {{failed}} 个",
    importFailed: "导入失败",
    importFailedMessage: "导入过程中发生错误",
    importProcessError: "导入处理过程中发生错误",

    addSuccess: "添加成功",
    addSuccessMessage: "{{name}} 添加成功",
    addFailed: "添加失败",
    addFailedMessage: "添加过程中发生错误",

    fileFormatError: "文件格式错误",
    fileFormatErrorMessage: "请选择Excel文件(.xlsx或.xls)",
    excelParseError: "Excel解析失败",
    cannotParseExcelFile: "无法解析Excel文件",
    parseProcessError: "解析过程中发生错误",

    tauriPluginNotInitialized: "Tauri插件未初始化",
    tauriEnvironmentRequired: "请确保在Tauri桌面环境中运行",
    fileSelectionFailed: "文件选择失败",
    cannotOpenFileDialog: "无法打开文件对话框",
    downloadFailed: "下载失败",
    downloadProcessError: "模板下载过程中发生错误",
    openFileFailed: "打开文件失败",
    cannotOpenDownloadedFile: "无法打开下载的文件",

    templateDownloadSuccess: "模板下载成功",
    downloadedToBrowser: "文件已下载到浏览器默认下载位置",
    templateSavedMessage: 'Excel模板文件 "{{fileName}}" 已保存到您的下载文件夹',

    info: "提示",
    fileSavedTo: "文件已保存到: {{filePath}}",
  },

  themeToggle: {
    lightTheme: "浅色主题",
    switchToLight: "切换到浅色主题",
    darkTheme: "深色主题",
    switchToDark: "切换到深色主题",
    systemTheme: "系统主题",
    followSystem: "跟随系统主题",
    system: "系统",
    dark: "深色",
    light: "浅色",
  },
};
