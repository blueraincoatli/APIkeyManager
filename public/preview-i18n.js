// 预览窗口国际化支持
class PreviewI18n {
  constructor() {
    this.currentLanguage = 'zh-CN';
    this.translations = {};
    this.init();
  }

  async init() {
    console.log('Initializing PreviewI18n...');

    // 从注入的数据中获取语言设置
    if (window.__PREVIEW_LANGUAGE__) {
      this.currentLanguage = window.__PREVIEW_LANGUAGE__;
      console.log('Using injected language:', this.currentLanguage);
    } else {
      // 优先从主应用保存的 localStorage 获取
      try {
        const savedLang = localStorage.getItem('app-language');
        if (savedLang) {
          this.currentLanguage = this.mapLanguageCode(savedLang);
          console.log('Using saved app-language:', savedLang, 'mapped to:', this.currentLanguage);
        } else {
          // 回退到系统语言
          const systemLang = navigator.language || navigator.userLanguage;
          this.currentLanguage = this.mapLanguageCode(systemLang);
          console.log('Using system language:', systemLang, 'mapped to:', this.currentLanguage);
        }
      } catch (e) {
        const systemLang = navigator.language || navigator.userLanguage;
        this.currentLanguage = this.mapLanguageCode(systemLang);
        console.log('Using system language (fallback):', systemLang, 'mapped to:', this.currentLanguage);
      }
    }

    await this.loadTranslations();
    console.log('PreviewI18n initialized successfully');
  }

  mapLanguageCode(lang) {
    // 映射浏览器语言代码到应用语言代码
    const langMap = {
      'zh': 'zh-CN',
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
      'en': 'en-US',
      'en-US': 'en-US',
      'es': 'es-ES',
      'es-ES': 'es-ES',
      'fr': 'fr-FR',
      'fr-FR': 'fr-FR',
      'it': 'it-IT',
      'it-IT': 'it-IT',
      'pt': 'pt-BR',
      'pt-BR': 'pt-BR',
      'ja': 'ja-JP',
      'ja-JP': 'ja-JP',
      'ru': 'ru-RU',
      'ru-RU': 'ru-RU'
    };

    return langMap[lang] || 'en-US';
  }

  async loadTranslations() {
    // 内嵌翻译数据，避免外部文件依赖
    this.translations = {
      'zh-CN': {
        title: '数据预览',
        loading: '正在加载数据...',
        emptyState: '暂无数据',
        tableHeaders: {
          name: '名称',
          apiKey: 'API Key',
          platform: '提供商',
          description: '描述',
          action: '操作'
        },
        buttons: {
          back: '返回',
          confirmImport: '确认导入'
        },
        tooltips: {
          delete: '删除此行',
          duplicate: '与已有数据或本批内重复'
        }
      },
      'en-US': {
        title: 'Data Preview',
        loading: 'Loading data...',
        emptyState: 'No data available',
        tableHeaders: {
          name: 'Name',
          apiKey: 'API Key',
          platform: 'Platform',
          description: 'Description',
          action: 'Action'
        },
        buttons: {
          back: 'Back',
          confirmImport: 'Confirm Import'
        },
        tooltips: {
          delete: 'Delete this row',
          duplicate: 'Duplicate with existing data or within batch'
        }
      },
      'zh-TW': {
        title: '資料預覽',
        loading: '正在載入資料...',
        emptyState: '暫無資料',
        tableHeaders: {
          name: '名稱',
          apiKey: 'API 金鑰',
          platform: '平台',
          description: '描述',
          action: '操作'
        },
        buttons: {
          back: '返回',
          confirmImport: '確認匯入'
        },
        tooltips: {
          delete: '刪除此列',
          duplicate: '與已有資料或本批內重複'
        }
      },
      'pt-BR': {
        title: 'Visualização de Dados',
        loading: 'Carregando dados...',
        emptyState: 'Nenhum dado disponível',
        tableHeaders: {
          name: 'Nome',
          apiKey: 'Chave API',
          platform: 'Plataforma',
          description: 'Descrição',
          action: 'Ação'
        },
        buttons: {
          back: 'Voltar',
          confirmImport: 'Confirmar Importação'
        },
        tooltips: {
          delete: 'Excluir esta linha',
          duplicate: 'Duplicado com dados existentes ou dentro do lote'
        }
      },
      'es-ES': {
        title: 'Vista Previa de Datos',
        loading: 'Cargando datos...',
        emptyState: 'No hay datos disponibles',
        tableHeaders: {
          name: 'Nombre',
          apiKey: 'Clave API',
          platform: 'Plataforma',
          description: 'Descripción',
          action: 'Acción'
        },
        buttons: {
          back: 'Volver',
          confirmImport: 'Confirmar Importación'
        },
        tooltips: {
          delete: 'Eliminar esta fila',
          duplicate: 'Duplicado con datos existentes o dentro del lote'
        }
      },
      'fr-FR': {
        title: 'Aperçu des Données',
        loading: 'Chargement des données...',
        emptyState: 'Aucune donnée disponible',
        tableHeaders: {
          name: 'Nom',
          apiKey: 'Clé API',
          platform: 'Plateforme',
          description: 'Description',
          action: 'Action'
        },
        buttons: {
          back: 'Retour',
          confirmImport: 'Confirmer l\'Importation'
        },
        tooltips: {
          delete: 'Supprimer cette ligne',
          duplicate: 'Doublon avec données existantes ou dans le lot'
        }
      },
      'it-IT': {
        title: 'Anteprima Dati',
        loading: 'Caricamento dati...',
        emptyState: 'Nessun dato disponibile',
        tableHeaders: {
          name: 'Nome',
          apiKey: 'Chiave API',
          platform: 'Piattaforma',
          description: 'Descrizione',
          action: 'Azione'
        },
        buttons: {
          back: 'Indietro',
          confirmImport: 'Conferma Importazione'
        },
        tooltips: {
          delete: 'Elimina questa riga',
          duplicate: 'Duplicato con dati esistenti o all\'interno del lotto'
        }
      },
      'ja-JP': {
        title: 'データプレビュー',
        loading: 'データを読み込み中...',
        emptyState: 'データがありません',
        tableHeaders: {
          name: '名前',
          apiKey: 'APIキー',
          platform: 'プラットフォーム',
          description: '説明',
          action: '操作'
        },
        buttons: {
          back: '戻る',
          confirmImport: 'インポートを確認'
        },
        tooltips: {
          delete: 'この行を削除',
          duplicate: '既存データまたはバッチ内と重複'
        }
      },
      'ru-RU': {
        title: 'Предпросмотр Данных',
        loading: 'Загрузка данных...',
        emptyState: 'Нет доступных данных',
        tableHeaders: {
          name: 'Имя',
          apiKey: 'Ключ API',
          platform: 'Платформа',
          description: 'Описание',
          action: 'Действие'
        },
        buttons: {
          back: 'Назад',
          confirmImport: 'Подтвердить Импорт'
        },
        tooltips: {
          delete: 'Удалить эту строку',
          duplicate: 'Дубликат с существующими данными или внутри пакета'
        }
      }
    };
  }

  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    console.log('Translating key:', key, 'for language:', this.currentLanguage);

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn('Translation not found for key:', key, 'in language:', this.currentLanguage);
        return key; // 返回key作为fallback
      }
    }

    if (typeof value === 'string') {
      // 简单的参数替换
      const result = value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
      console.log('Translation result:', result);
      return result;
    }

    console.warn('Translation is not a string for key:', key, 'value:', value);
    return key; // 返回key作为fallback
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

// 创建全局实例并立即初始化
window.previewI18n = new PreviewI18n();

// 立即初始化，不等待 DOM 加载
window.previewI18n.init().then(() => {
  console.log('PreviewI18n initialized early, current language:', window.previewI18n.getCurrentLanguage());
}).catch(err => {
  console.error('Failed to initialize PreviewI18n early:', err);
});

// 等待DOM加载完成后更新文本
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, updating i18n text...');

  // 确保 PreviewI18n 实例存在
  if (!window.previewI18n) {
    console.error('PreviewI18n instance not found');
    return;
  }

  // 等待初始化完成（如果还没完成的话）
  try {
    await window.previewI18n.init();
    console.log('i18n initialized, current language:', window.previewI18n.getCurrentLanguage());
  } catch (err) {
    console.error('Failed to initialize i18n in DOMContentLoaded:', err);
  }

  // 更新页面标题
  document.title = window.previewI18n.t('title');

  // 立即更新一次
  updateAllText();

  // 监听语言变化（如果有动态切换需求）
  if (window.__PREVIEW_LANGUAGE_CHANGE__) {
    window.__PREVIEW_LANGUAGE_CHANGE__((newLang) => {
      console.log('Language changed to:', newLang);
      window.previewI18n.currentLanguage = window.previewI18n.mapLanguageCode(newLang);
      updateAllText();
    });
  }

  // 监听来自主窗口的语言变化事件（postMessage）
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'language-change') {
      console.log('Received language change event:', event.data.language);
      window.previewI18n.currentLanguage = window.previewI18n.mapLanguageCode(event.data.language);
      updateAllText();
    }
  });

  // 监听 Tauri 事件总线的语言变化（如果可用）
  try {
    if (window.__TAURI__ && window.__TAURI__.event && window.__TAURI__.event.listen) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      window.__TAURI__.event.listen('language-change', (e) => {
        const lang = (e && e.payload) ? String(e.payload) : 'en-US';
        console.log('Received tauri language-change event:', lang);
        window.previewI18n.currentLanguage = window.previewI18n.mapLanguageCode(lang);
        updateAllText();
      });
    }
  } catch (_) { /* ignore */ }
});

// 提供全局语言切换函数
window.changePreviewLanguage = (language) => {
  console.log('Manual language change to:', language);
  if (window.previewI18n) {
    window.previewI18n.currentLanguage = window.previewI18n.mapLanguageCode(language);
    updateAllText();
  }
};

// 统一的文本更新函数
function updateAllText() {
  if (!window.previewI18n) {
    console.error('PreviewI18n instance not found');
    return;
  }

  console.log('Updating all text for language:', window.previewI18n.getCurrentLanguage());

  // 更新页面标题
  document.title = window.previewI18n.t('title');

  // 更新标题
  const pageTitle = document.querySelector('.preview-page-title');
  if (pageTitle) {
    const newTitle = window.previewI18n.t('title');
    pageTitle.textContent = newTitle;
    console.log('Updated page title to:', newTitle);
  }

  // 更新加载文本
  const loading = document.getElementById('loading');
  if (loading) {
    const newLoading = window.previewI18n.t('loading');
    loading.textContent = newLoading;
    console.log('Updated loading text to:', newLoading);
  }

  // 更新空状态文本
  const emptyState = document.getElementById('empty-state');
  if (emptyState) {
    const emptyText = emptyState.querySelector('div:last-child');
    if (emptyText) {
      const newEmptyState = window.previewI18n.t('emptyState');
      emptyText.textContent = newEmptyState;
      console.log('Updated empty state text to:', newEmptyState);
    }
  }

  // 更新表格头部
  const headers = document.querySelectorAll('.preview-table-header-cell');
  if (headers.length >= 5) {
    const nameHeader = window.previewI18n.t('tableHeaders.name');
    const apiKeyHeader = window.previewI18n.t('tableHeaders.apiKey');

  // 同步更新表格内的工具提示（重复提示与删除按钮）
  try {
    // 1) 更新 API Key 单元格的重复提示
    document.querySelectorAll('.preview-table-body .api-key').forEach((td) => {
      const isDup = td.getAttribute('data-duplicate') === 'true' || (td.title && td.title.length > 0);
      td.title = isDup ? window.previewI18n.t('tooltips.duplicate') : '';
    });
    // 2) 更新每行删除按钮的提示
    document.querySelectorAll('.preview-table-body .delete-btn').forEach((btn) => {
      btn.title = window.previewI18n.t('tooltips.delete');
    });
  } catch (_) { /* ignore */ }

    const platformHeader = window.previewI18n.t('tableHeaders.platform');
    const descriptionHeader = window.previewI18n.t('tableHeaders.description');
    const actionHeader = window.previewI18n.t('tableHeaders.action');

    headers[0].textContent = nameHeader;
    headers[1].textContent = apiKeyHeader;
    headers[2].textContent = platformHeader;
    headers[3].textContent = descriptionHeader;
    headers[4].textContent = actionHeader;
    console.log('Updated table headers:', [nameHeader, apiKeyHeader, platformHeader, descriptionHeader, actionHeader]);
  }

  // 更新按钮文本
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) {
    const newCancelBtn = window.previewI18n.t('buttons.back');
    cancelBtn.textContent = newCancelBtn;
    console.log('Updated cancel button to:', newCancelBtn);
  }

  const confirmBtn = document.getElementById('confirm-btn');
  if (confirmBtn) {
    const newConfirmBtn = window.previewI18n.t('buttons.confirmImport');
    confirmBtn.textContent = newConfirmBtn;
    console.log('Updated confirm button to:', newConfirmBtn);
  }
}

// 暴露到全局作用域
window.updateAllText = updateAllText;