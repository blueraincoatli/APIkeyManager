export default {
  common: {
    ok: "OK",
    cancel: "Cancelar",
    close: "Fechar",
    save: "Salvar",
    delete: "Excluir",
    edit: "Editar",
    copy: "Copiar",
    search: "Pesquisar",
    add: "Adicionar",
    settings: "Configurações",
    exit: "Sair",
    confirm: "Confirmar",
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    warning: "Aviso",
  },

  floatingToolbar: {
    searchPlaceholder: "Pesquisar chaves API...",
    addApiKey: "Adicionar Chave API",
    more: "Mais",
    settings: "Configurações",
    exit: "Sair do Aplicativo",
    loadingPlatforms: "Carregando plataformas...",
  },

  settings: {
    title: "Configurações",
    theme: "Tema",
    language: "Idioma",
    shortcuts: "Atalhos",
    aboutTitle: "Sobre",

    themeOptions: {
      light: "Claro",
      dark: "Escuro",
      system: "Sistema",
    },

    shortcutsToggle: "Mostrar/Ocultar",

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description:
        "Uma ferramenta moderna de gerenciamento de chaves API para desenvolvedores armazenarem e gerenciarem chaves API com segurança.",
    },
  },

  apiKey: {
    name: "Nome",
    keyValue: "Chave API",
    platform: "Plataforma",
    description: "Descrição",
    tags: "Tags",
    group: "Grupo",
    createdAt: "Criado",
    updatedAt: "Atualizado",
    lastUsed: "Último Uso",

    actions: {
      add: "Adicionar Chave API",
      edit: "Editar",
      delete: "Excluir",
      copy: "Copiar",
      copySuccess: "Copiado para a área de transferência",
      copyWarning:
        "A chave API foi copiada para a área de transferência. Esteja ciente dos riscos de segurança. O sistema limpará a área de transferência em 30 segundos.",
      deleteConfirm: "Tem certeza de que deseja excluir?",
      deleteSuccess: "Chave API removida do sistema",
      editSuccess: "Atualizado com sucesso",
    },

    form: {
      nameLabel: "Nome",
      namePlaceholder: "Digite o nome da chave API",
      keyLabel: "Chave API",
      keyPlaceholder: "Digite a chave API",
      platformLabel: "Plataforma",
      platformPlaceholder: "Selecione a plataforma",
      descriptionLabel: "Descrição",
      descriptionPlaceholder: "Digite a descrição (opcional)",
      tagsLabel: "Tags",
      tagsPlaceholder: "Digite as tags separadas por vírgulas",
      submit: "Salvar",
      cancel: "Cancelar",
    },
  },

  searchResults: {
    noResults: "Nenhum resultado",
    namePlaceholder: "Nome",
    keyPlaceholder: "Chave API",
    save: "Salvar",
    cancel: "Cancelar",
    confirmDelete: "Tem certeza de que deseja excluir?",
    confirm: "Confirmar",
    edit: "Editar",
    delete: "Excluir",
    copy: "Copiar",
    copySuccess: "Copia Bem-sucedida",
    copySuccessMessage:
      "A chave API foi copiada para a área de transferência. Esteja ciente dos riscos de segurança. O sistema limpará a área de transferência em 30 segundos.",
    copyFailed: "Falha ao Copiar",
    copyFailedMessage:
      "Não foi possível copiar a chave API para a área de transferência",
    editSuccess: "Edição Bem-sucedida",
    editSuccessMessage: "{{name}} atualizado com sucesso",
    editFailed: "Falha na Edição",
    editFailedMessage: "Não foi possível atualizar a chave API",
    deleteSuccess: "Exclusão Bem-sucedida",
    deleteSuccessMessage: "Chave API removida do sistema",
    deleteFailed: "Falha na Exclusão",
    deleteFailedMessage: "Não foi possível excluir a chave API",
    unknownError: "Ocorreu um erro desconhecido",
    close: "Fechar",
  },

  radialMenu: {
    loading: "Carregando plataformas...",
  },

  modal: {
    copySuccess: {
      title: "Copia Bem-sucedida",
      message:
        "A chave API foi copiada para a área de transferência. Esteja ciente dos riscos de segurança. O sistema limpará a área de transferência em 30 segundos.",
      confirm: "OK",
    },
    copyError: {
      title: "Falha ao Copiar",
      message:
        "Não foi possível copiar a chave API para a área de transferência",
      close: "Fechar",
    },
    editSuccess: {
      title: "Edição Bem-sucedida",
      message: "Atualizado com sucesso",
      confirm: "OK",
    },
    editError: {
      title: "Falha na Edição",
      message: "Não foi possível atualizar a chave API",
      close: "Fechar",
    },
    deleteSuccess: {
      title: "Exclusão Bem-sucedida",
      message: "Chave API removida do sistema",
      confirm: "OK",
    },
    deleteError: {
      title: "Falha na Exclusão",
      message: "Não foi possível excluir a chave API",
      close: "Fechar",
    },
    genericError: {
      title: "Erro",
      message: "Ocorreu um erro desconhecido",
      close: "Fechar",
    },
  },

  errors: {
    generic: "Ocorreu um erro desconhecido",
    network: "Ocorreu um erro de rede",
    database: "Ocorreu um erro de banco de dados",
    validation: "Ocorreu um erro de validação",
    permission: "Acesso negado",
    notFound: "Recurso não encontrado",
  },

  addApiKeyDialog: {
    title: "Adicionar Chave API",
    batchImport: "Importação em Lote",
    batchImportInstructions:
      "Use o modelo Excel para importar chaves API em lote. Por favor, baixe o modelo primeiro, preencha os dados e depois faça o upload.",
    downloadTemplate: "Baixar Modelo",
    selectExcelFile: "Selecionar Arquivo Excel",
    supportedFormats: "Formatos suportados: Arquivos Excel (.xlsx)",
    requiredColumns:
      "Colunas obrigatórias: Nome | Chave API | Plataforma | Descrição",
    savedToDownloads: "Salvo na pasta de downloads",
    openFile: "Abrir Arquivo",
    back: "Voltar",
    submitting: "Enviando…",

    form: {
      nameLabel: "Nome",
      namePlaceholder: "Por favor, digite o nome da chave API",
      keyLabel: "Chave API",
      keyPlaceholder: "Por favor, digite a chave API",
      platformLabel: "Plataforma",
      platformPlaceholder: "ex.: OpenAI, Claude, Gemini...",
      descriptionLabel: "Descrição",
      descriptionPlaceholder: "Descrição opcional...",
    },

    errors: {
      nameRequired: "Nome é obrigatório",
      keyRequired: "Chave API é obrigatória",
      keyInvalid: "Formato da chave API é inválido",
    },

    previewNotAvailable: "Visualização não disponível",
    previewNotAvailableMessage:
      "Por favor, use a função de visualização no ambiente desktop",
    previewWindowError: "Erro na janela de visualização",
    error: "Erro",

    importSuccess: "Importação Bem-sucedida",
    importSuccessMessage:
      "{{succeeded}} chaves API importadas com sucesso, {{failed}} falharam",
    importFailed: "Falha na Importação",
    importFailedMessage: "Erro ocorrido durante a importação",
    importProcessError: "Erro ocorrido durante o processamento da importação",

    addSuccess: "Adição Bem-sucedida",
    addSuccessMessage: "{{name}} adicionado com sucesso",
    addFailed: "Falha na Adição",
    addFailedMessage: "Erro ocorrido durante a adição",

    fileFormatError: "Erro de Formato de Arquivo",
    fileFormatErrorMessage:
      "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
    excelParseError: "Erro de Análise do Excel",
    cannotParseExcelFile: "Não é possível analisar o arquivo Excel",
    parseProcessError: "Erro ocorrido durante a análise",

    tauriPluginNotInitialized: "Plugin Tauri não inicializado",
    tauriEnvironmentRequired:
      "Por favor, certifique-se de executar no ambiente desktop Tauri",
    fileSelectionFailed: "Falha na Seleção de Arquivo",
    cannotOpenFileDialog: "Não é possível abrir o diálogo de arquivo",
    downloadFailed: "Falha no Download",
    downloadProcessError: "Erro ocorrido durante o download do modelo",
    openFileFailed: "Falha ao Abrir Arquivo",
    cannotOpenDownloadedFile: "Não é possível abrir o arquivo baixado",

    templateDownloadSuccess: "Download do modelo bem-sucedido",
    downloadedToBrowser:
      "Arquivo baixado para o local padrão de downloads do navegador",
    templateSavedMessage:
      'O arquivo do modelo Excel "{{fileName}}" foi salvo na sua pasta de downloads',

    info: "Informação",
    fileSavedTo: "Arquivo salvo em: {{filePath}}",
  },

  themeToggle: {
    lightTheme: "Tema Claro",
    switchToLight: "Mudar para Tema Claro",
    darkTheme: "Tema Escuro",
    switchToDark: "Mudar para Tema Escuro",
    systemTheme: "Tema do Sistema",
    followSystem: "Seguir Tema do Sistema",
    system: "Sistema",
    dark: "Escuro",
    light: "Claro",
  },
};
