// 预览窗口国际化支持
class PreviewI18n {
  constructor() {
    this.currentLanguage = 'zh-CN';
    this.translations = {};
    this.init();
  }

  async init() {
    // 从注入的数据中获取语言设置
    if (window.__PREVIEW_LANGUAGE__) {
      this.currentLanguage = window.__PREVIEW_LANGUAGE__;
    } else {
      // 尝试从系统语言获取
      const systemLang = navigator.language || navigator.userLanguage;
      this.currentLanguage = this.mapLanguageCode(systemLang);
    }

    await this.loadTranslations();
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
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // 返回key作为fallback
      }
    }

    if (typeof value === 'string') {
      // 简单的参数替换
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
    }

    return key; // 返回key作为fallback
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

// 创建全局实例
window.previewI18n = new PreviewI18n();

// 等待DOM加载完成后更新文本
document.addEventListener('DOMContentLoaded', async () => {
  await window.previewI18n.init();
  
  // 更新页面标题
  document.title = window.previewI18n.t('title');
  
  // 更新页面中的文本
  const updateTextContent = () => {
    // 更新标题
    const pageTitle = document.querySelector('.preview-page-title');
    if (pageTitle) {
      pageTitle.textContent = window.previewI18n.t('title');
    }
    
    // 更新加载文本
    const loading = document.getElementById('loading');
    if (loading) {
      loading.textContent = window.previewI18n.t('loading');
    }
    
    // 更新空状态文本
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
      const emptyText = emptyState.querySelector('div:last-child');
      if (emptyText) {
        emptyText.textContent = window.previewI18n.t('emptyState');
      }
    }
    
    // 更新表格头部
    const headers = document.querySelectorAll('.preview-table-header-cell');
    if (headers.length >= 5) {
      headers[0].textContent = window.previewI18n.t('tableHeaders.name');
      headers[1].textContent = window.previewI18n.t('tableHeaders.apiKey');
      headers[2].textContent = window.previewI18n.t('tableHeaders.platform');
      headers[3].textContent = window.previewI18n.t('tableHeaders.description');
      headers[4].textContent = window.previewI18n.t('tableHeaders.action');
    }
    
    // 更新按钮文本
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
      cancelBtn.textContent = window.previewI18n.t('buttons.back');
    }
    
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
      confirmBtn.textContent = window.previewI18n.t('buttons.confirmImport');
    }
  };
  
  // 立即更新一次
  updateTextContent();
  
  // 监听语言变化（如果有动态切换需求）
  if (window.__PREVIEW_LANGUAGE_CHANGE__) {
    window.__PREVIEW_LANGUAGE_CHANGE__((newLang) => {
      window.previewI18n.currentLanguage = window.previewI18n.mapLanguageCode(newLang);
      updateTextContent();
    });
  }
});