export default {
  common: {
    ok: "OK",
    cancel: "キャンセル",
    close: "閉じる",
    save: "保存",
    delete: "削除",
    edit: "編集",
    copy: "コピー",
    search: "検索",
    add: "追加",
    settings: "設定",
    exit: "終了",
    confirm: "確認",
    loading: "読み込み中...",
    error: "エラー",
    success: "成功",
    warning: "警告"
  },

  toolbar: {
    searchPlaceholder: "APIキーを検索...",
    addApiKey: "APIキーを追加",
    more: "その他",
    settings: "設定",
    exitApp: "アプリケーションを終了",
    exitTooltip: "アプリケーションを終了"
  },

  settings: {
    title: "設定",
    theme: "テーマ",
    language: "言語",
    shortcuts: "ショートカット",
    about: "について",
    
    themeOptions: {
      light: "ライト",
      dark: "ダーク",
      system: "システム"
    },

    shortcuts: {
      toggleToolbar: "表示/非表示"
    },

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description: "開発者がAPIキーを安全に保存・管理するための現代的なAPIキー管理ツールです。"
    }
  },

  apiKey: {
    name: "名前",
    keyValue: "APIキー",
    platform: "プラットフォーム",
    description: "説明",
    tags: "タグ",
    group: "グループ",
    createdAt: "作成日時",
    updatedAt: "更新日時",
    lastUsed: "最終使用",

    actions: {
      add: "APIキーを追加",
      edit: "編集",
      delete: "削除",
      copy: "コピー",
      copySuccess: "クリップボードにコピーしました",
      copyWarning: "APIキーがクリップボードにコピーされました。セキュリティリスクにご注意ください。システムは30秒後にクリップボードをクリアします。",
      deleteConfirm: "削除してもよろしいですか？",
      deleteSuccess: "APIキーがシステムから削除されました",
      editSuccess: "更新が成功しました"
    },

    form: {
      nameLabel: "名前",
      namePlaceholder: "APIキー名を入力",
      keyLabel: "APIキー",
      keyPlaceholder: "APIキーを入力",
      platformLabel: "プラットフォーム",
      platformPlaceholder: "プラットフォームを選択",
      descriptionLabel: "説明",
      descriptionPlaceholder: "説明を入力（オプション）",
      tagsLabel: "タグ",
      tagsPlaceholder: "タグをカンマで区切って入力",
      submit: "保存",
      cancel: "キャンセル"
    }
  },

  search: {
    noResults: "結果がありません",
    empty: "結果が見つかりませんでした"
  },

  radialMenu: {
    loading: "プラットフォームを読み込み中..."
  },

  modal: {
    copySuccess: {
      title: "コピー成功",
      message: "APIキーがクリップボードにコピーされました。セキュリティリスクにご注意ください。システムは30秒後にクリップボードをクリアします。",
      confirm: "OK"
    },
    copyError: {
      title: "コピー失敗",
      message: "APIキーをクリップボードにコピーできませんでした",
      close: "閉じる"
    },
    editSuccess: {
      title: "編集成功",
      message: "更新が成功しました",
      confirm: "OK"
    },
    editError: {
      title: "編集失敗",
      message: "APIキーを更新できませんでした",
      close: "閉じる"
    },
    deleteSuccess: {
      title: "削除成功",
      message: "APIキーがシステムから削除されました",
      confirm: "OK"
    },
    deleteError: {
      title: "削除失敗",
      message: "APIキーを削除できませんでした",
      close: "閉じる"
    },
    genericError: {
      title: "エラー",
      message: "不明なエラーが発生しました",
      close: "閉じる"
    }
  },

  errors: {
    generic: "不明なエラーが発生しました",
    network: "ネットワークエラーが発生しました",
    database: "データベースエラーが発生しました",
    validation: "検証エラーが発生しました",
    permission: "アクセスが拒否されました",
    notFound: "リソースが見つかりません"
  }
};