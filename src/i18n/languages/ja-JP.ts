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
    warning: "警告",
  },

  floatingToolbar: {
    searchPlaceholder: "APIキーを検索...",
    addApiKey: "APIキーを追加",
    more: "その他",
    settings: "設定",
    exit: "アプリケーションを終了",
    loadingPlatforms: "プラットフォームを読み込み中...",
  },

  settings: {
    title: "設定",
    theme: "テーマ",
    language: "言語",
    shortcuts: "ショートカット",
    aboutTitle: "について",

    themeOptions: {
      light: "ライト",
      dark: "ダーク",
      system: "システム",
    },

    shortcutsToggle: "表示/非表示",

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description:
        "開発者がAPIキーを安全に保存・管理するための現代的なAPIキー管理ツールです。",
    },
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
      copyWarning:
        "APIキーがクリップボードにコピーされました。セキュリティリスクにご注意ください。システムは30秒後にクリップボードをクリアします。",
      deleteConfirm: "削除してもよろしいですか？",
      deleteSuccess: "APIキーがシステムから削除されました",
      editSuccess: "更新が成功しました",
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
      cancel: "キャンセル",
    },
  },

  searchResults: {
    noResults: "結果がありません",
    namePlaceholder: "名前",
    keyPlaceholder: "APIキー",
    save: "保存",
    cancel: "キャンセル",
    confirmDelete: "削除してもよろしいですか？",
    confirm: "確認",
    edit: "編集",
    delete: "削除",
    copy: "コピー",
    copySuccess: "コピー成功",
    copySuccessMessage:
      "APIキーがクリップボードにコピーされました。セキュリティリスクにご注意ください。システムは30秒後にクリップボードをクリアします。",
    copyFailed: "コピー失敗",
    copyFailedMessage: "APIキーをクリップボードにコピーできませんでした",
    editSuccess: "編集成功",
    editSuccessMessage: "{{name}}の更新が成功しました",
    editFailed: "編集失敗",
    editFailedMessage: "APIキーを更新できませんでした",
    deleteSuccess: "削除成功",
    deleteSuccessMessage: "APIキーがシステムから削除されました",
    deleteFailed: "削除失敗",
    deleteFailedMessage: "APIキーを削除できませんでした",
    unknownError: "不明なエラーが発生しました",
    close: "閉じる",
  },

  radialMenu: {
    loading: "プラットフォームを読み込み中...",
  },

  modal: {
    copySuccess: {
      title: "コピー成功",
      message:
        "APIキーがクリップボードにコピーされました。セキュリティリスクにご注意ください。システムは30秒後にクリップボードをクリアします。",
      confirm: "OK",
    },
    copyError: {
      title: "コピー失敗",
      message: "APIキーをクリップボードにコピーできませんでした",
      close: "閉じる",
    },
    editSuccess: {
      title: "編集成功",
      message: "更新が成功しました",
      confirm: "OK",
    },
    editError: {
      title: "編集失敗",
      message: "APIキーを更新できませんでした",
      close: "閉じる",
    },
    deleteSuccess: {
      title: "削除成功",
      message: "APIキーがシステムから削除されました",
      confirm: "OK",
    },
    deleteError: {
      title: "削除失敗",
      message: "APIキーを削除できませんでした",
      close: "閉じる",
    },
    genericError: {
      title: "エラー",
      message: "不明なエラーが発生しました",
      close: "閉じる",
    },
  },

  errors: {
    generic: "不明なエラーが発生しました",
    network: "ネットワークエラーが発生しました",
    database: "データベースエラーが発生しました",
    validation: "検証エラーが発生しました",
    permission: "アクセスが拒否されました",
    notFound: "リソースが見つかりません",
  },

  addApiKeyDialog: {
    title: "APIキーを追加",
    batchImport: "一括インポート",
    batchImportInstructions:
      "Excelテンプレートを使用してAPIキーを一括インポートします。まずテンプレートをダウンロードし、データを入力してからアップロードしてください。",
    downloadTemplate: "テンプレートをダウンロード",
    selectExcelFile: "Excelファイルを選択",
    supportedFormats: "サポートされている形式：Excelファイル (.xlsx)",
    requiredColumns: "必須列：名前 | APIキー | プラットフォーム | 説明",
    savedToDownloads: "ダウンロードフォルダに保存されました",
    openFile: "ファイルを開く",
    back: "戻る",
    submitting: "送信中…",

    form: {
      nameLabel: "名前",
      namePlaceholder: "APIキー名を入力してください",
      keyLabel: "APIキー",
      keyPlaceholder: "APIキーを入力してください",
      platformLabel: "プラットフォーム",
      platformPlaceholder: "例：OpenAI、Claude、Gemini...",
      descriptionLabel: "説明",
      descriptionPlaceholder: "オプションの説明...",
    },

    errors: {
      nameRequired: "名前は必須です",
      keyRequired: "APIキーは必須です",
      keyInvalid: "APIキーの形式が無効です",
    },

    previewNotAvailable: "プレビューは利用できません",
    previewNotAvailableMessage:
      "デスクトップ環境でプレビュー機能を使用してください",
    previewWindowError: "プレビューウィンドウエラー",
    error: "エラー",

    importSuccess: "インポート成功",
    importSuccessMessage:
      "{{succeeded}}件のAPIキーがインポートされ、{{failed}}件が失敗しました",
    importFailed: "インポート失敗",
    importFailedMessage: "インポート中にエラーが発生しました",
    importProcessError: "インポート処理中にエラーが発生しました",

    addSuccess: "追加成功",
    addSuccessMessage: "{{name}}が追加されました",
    addFailed: "追加失敗",
    addFailedMessage: "追加中にエラーが発生しました",

    fileFormatError: "ファイル形式エラー",
    fileFormatErrorMessage:
      "Excelファイル（.xlsxまたは.xls）を選択してください",
    excelParseError: "Excel解析エラー",
    cannotParseExcelFile: "Excelファイルを解析できません",
    parseProcessError: "解析中にエラーが発生しました",

    tauriPluginNotInitialized: "Tauriプラグインが初期化されていません",
    tauriEnvironmentRequired:
      "Tauriデスクトップ環境で実行していることを確認してください",
    fileSelectionFailed: "ファイル選択に失敗しました",
    cannotOpenFileDialog: "ファイルダイアログを開けません",
    downloadFailed: "ダウンロードに失敗しました",
    downloadProcessError: "テンプレートのダウンロード中にエラーが発生しました",
    openFileFailed: "ファイルを開けませんでした",
    cannotOpenDownloadedFile: "ダウンロードしたファイルを開けません",

    templateDownloadSuccess: "テンプレートのダウンロードが成功しました",
    downloadedToBrowser:
      "ファイルがブラウザのデフォルトダウンロード場所にダウンロードされました",
    templateSavedMessage:
      'Excelテンプレートファイル "{{fileName}}" がダウンロードフォルダに保存されました',

    info: "情報",
    fileSavedTo: "ファイルが保存されました：{{filePath}}",
  },

  themeToggle: {
    lightTheme: "ライトテーマ",
    switchToLight: "ライトテーマに切り替え",
    darkTheme: "ダークテーマ",
    switchToDark: "ダークテーマに切り替え",
    systemTheme: "システムテーマ",
    followSystem: "システムテーマに従う",
    system: "システム",
    dark: "ダーク",
    light: "ライト",
  },
};
