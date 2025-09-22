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
    warning: "警告"
  },

  toolbar: {
    searchPlaceholder: "搜索API密钥...",
    addApiKey: "添加API密钥",
    more: "更多",
    settings: "设置",
    exitApp: "退出应用程序",
    exitTooltip: "退出应用程序"
  },

  settings: {
    title: "设置",
    theme: "颜色主题",
    language: "语言",
    shortcuts: "快捷键",
    about: "关于",
    
    themeOptions: {
      light: "浅色",
      dark: "深色",
      system: "系统"
    },

    shortcuts: {
      toggleToolbar: "召唤/隐藏"
    },

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description: "一个现代化的API密钥管理工具，帮助开发者安全地存储和管理API密钥。"
    }
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
      copyWarning: "API密钥已复制到剪贴板，请注意风险。系统将在30秒后自动清空剪贴板。",
      deleteConfirm: "确定要删除吗？",
      deleteSuccess: "API密钥已从系统中移除",
      editSuccess: "更新成功"
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
      cancel: "取消"
    }
  },

  search: {
    noResults: "暂无结果",
    empty: "未找到结果"
  },

  radialMenu: {
    loading: "加载平台中..."
  },

  modal: {
    copySuccess: {
      title: "复制成功",
      message: "API密钥已复制到剪贴板，请注意风险。系统将在30秒后自动清空剪贴板。",
      confirm: "确定"
    },
    copyError: {
      title: "复制失败",
      message: "无法将API密钥复制到剪贴板",
      close: "关闭"
    },
    editSuccess: {
      title: "编辑成功",
      message: "更新成功",
      confirm: "确定"
    },
    editError: {
      title: "编辑失败",
      message: "无法更新API密钥",
      close: "关闭"
    },
    deleteSuccess: {
      title: "删除成功",
      message: "API密钥已从系统中移除",
      confirm: "确定"
    },
    deleteError: {
      title: "删除失败",
      message: "无法删除API密钥",
      close: "关闭"
    },
    genericError: {
      title: "错误",
      message: "发生未知错误",
      close: "关闭"
    }
  },

  errors: {
    generic: "发生未知错误",
    network: "发生网络错误",
    database: "发生数据库错误",
    validation: "发生验证错误",
    permission: "权限被拒绝",
    notFound: "资源未找到"
  }
};