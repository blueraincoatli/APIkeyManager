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
    warning: "Aviso"
  },

  toolbar: {
    searchPlaceholder: "Pesquisar chaves API...",
    addApiKey: "Adicionar Chave API",
    more: "Mais",
    settings: "Configurações",
    exitApp: "Sair do Aplicativo",
    exitTooltip: "Sair do Aplicativo"
  },

  settings: {
    title: "Configurações",
    theme: "Tema",
    language: "Idioma",
    shortcuts: "Atalhos",
    about: "Sobre",
    
    themeOptions: {
      light: "Claro",
      dark: "Escuro",
      system: "Sistema"
    },

    shortcuts: {
      toggleToolbar: "Mostrar/Ocultar"
    },

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description: "Uma ferramenta moderna de gerenciamento de chaves API para desenvolvedores armazenarem e gerenciarem chaves API com segurança."
    }
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
      copyWarning: "A chave API foi copiada para a área de transferência. Esteja ciente dos riscos de segurança. O sistema limpará a área de transferência em 30 segundos.",
      deleteConfirm: "Tem certeza de que deseja excluir?",
      deleteSuccess: "Chave API removida do sistema",
      editSuccess: "Atualizado com sucesso"
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
      cancel: "Cancelar"
    }
  },

  search: {
    noResults: "Nenhum resultado",
    empty: "Nenhum resultado encontrado"
  },

  radialMenu: {
    loading: "Carregando plataformas..."
  },

  modal: {
    copySuccess: {
      title: "Copia Bem-sucedida",
      message: "A chave API foi copiada para a área de transferência. Esteja ciente dos riscos de segurança. O sistema limpará a área de transferência em 30 segundos.",
      confirm: "OK"
    },
    copyError: {
      title: "Falha ao Copiar",
      message: "Não foi possível copiar a chave API para a área de transferência",
      close: "Fechar"
    },
    editSuccess: {
      title: "Edição Bem-sucedida",
      message: "Atualizado com sucesso",
      confirm: "OK"
    },
    editError: {
      title: "Falha na Edição",
      message: "Não foi possível atualizar a chave API",
      close: "Fechar"
    },
    deleteSuccess: {
      title: "Exclusão Bem-sucedida",
      message: "Chave API removida do sistema",
      confirm: "OK"
    },
    deleteError: {
      title: "Falha na Exclusão",
      message: "Não foi possível excluir a chave API",
      close: "Fechar"
    },
    genericError: {
      title: "Erro",
      message: "Ocorreu um erro desconhecido",
      close: "Fechar"
    }
  },

  errors: {
    generic: "Ocorreu um erro desconhecido",
    network: "Ocorreu um erro de rede",
    database: "Ocorreu um erro de banco de dados",
    validation: "Ocorreu um erro de validação",
    permission: "Acesso negado",
    notFound: "Recurso não encontrado"
  }
};