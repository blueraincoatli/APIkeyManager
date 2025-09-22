export default {
  common: {
    ok: "OK",
    cancel: "Annulla",
    close: "Chiudi",
    save: "Salva",
    delete: "Elimina",
    edit: "Modifica",
    copy: "Copia",
    search: "Cerca",
    add: "Aggiungi",
    settings: "Impostazioni",
    exit: "Esci",
    confirm: "Conferma",
    loading: "Caricamento...",
    error: "Errore",
    success: "Successo",
    warning: "Avvertimento"
  },

  floatingToolbar: {
    searchPlaceholder: "Cerca chiavi API...",
    addApiKey: "Aggiungi Chiave API",
    more: "Altro",
    settings: "Impostazioni",
    exit: "Esci dall'Applicazione",
    loadingPlatforms: "Caricamento piattaforme..."
  },

  settings: {
    title: "Impostazioni",
    theme: "Tema",
    language: "Lingua",
    shortcuts: "Scorciatoie",
    aboutTitle: "Informazioni",
    
    themeOptions: {
      light: "Chiaro",
      dark: "Scuro",
      system: "Sistema"
    },

    shortcutsToggle: "Mostra/Nascondi",

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description: "Uno strumento moderno di gestione delle chiavi API per gli sviluppatori per memorizzare e gestire in modo sicuro le chiavi API."
    }
  },

  apiKey: {
    name: "Nome",
    keyValue: "Chiave API",
    platform: "Piattaforma",
    description: "Descrizione",
    tags: "Tag",
    group: "Gruppo",
    createdAt: "Creato",
    updatedAt: "Aggiornato",
    lastUsed: "Ultimo Utilizzo",

    actions: {
      add: "Aggiungi Chiave API",
      edit: "Modifica",
      delete: "Elimina",
      copy: "Copia",
      copySuccess: "Copiato negli appunti",
      copyWarning: "La chiave API è stata copiata negli appunti. Si prega di essere consapevoli dei rischi di sicurezza. Il sistema cancellerà gli appunti tra 30 secondi.",
      deleteConfirm: "Sei sicuro di voler eliminare?",
      deleteSuccess: "Chiave API rimossa dal sistema",
      editSuccess: "Aggiornato con successo"
    },

    form: {
      nameLabel: "Nome",
      namePlaceholder: "Inserisci il nome della chiave API",
      keyLabel: "Chiave API",
      keyPlaceholder: "Inserisci la chiave API",
      platformLabel: "Piattaforma",
      platformPlaceholder: "Seleziona piattaforma",
      descriptionLabel: "Descrizione",
      descriptionPlaceholder: "Inserisci descrizione (opzionale)",
      tagsLabel: "Tag",
      tagsPlaceholder: "Inserisci tag separati da virgole",
      submit: "Salva",
      cancel: "Annulla"
    }
  },

  searchResults: {
    noResults: "Nessun risultato",
    namePlaceholder: "Nome",
    keyPlaceholder: "Chiave API",
    save: "Salva",
    cancel: "Annulla",
    confirmDelete: "Sei sicuro di voler eliminare?",
    confirm: "Conferma",
    edit: "Modifica",
    delete: "Elimina",
    copy: "Copia",
    copySuccess: "Copia Riuscita",
    copySuccessMessage: "La chiave API è stata copiata negli appunti. Si prega di essere consapevoli dei rischi di sicurezza. Il sistema cancellerà gli appunti tra 30 secondi.",
    copyFailed: "Copia Fallita",
    copyFailedMessage: "Impossibile copiare la chiave API negli appunti",
    editSuccess: "Modifica Riuscita",
    editSuccessMessage: "{{name}} aggiornato con successo",
    editFailed: "Modifica Fallita",
    editFailedMessage: "Impossibile aggiornare la chiave API",
    deleteSuccess: "Eliminazione Riuscita",
    deleteSuccessMessage: "Chiave API rimossa dal sistema",
    deleteFailed: "Eliminazione Fallita",
    deleteFailedMessage: "Impossibile eliminare la chiave API",
    unknownError: "Si è verificato un errore sconosciuto",
    close: "Chiudi"
  },

  radialMenu: {
    loading: "Caricamento piattaforme..."
  },

  modal: {
    copySuccess: {
      title: "Copia Riuscita",
      message: "La chiave API è stata copiata negli appunti. Si prega di essere consapevoli dei rischi di sicurezza. Il sistema cancellerà gli appunti tra 30 secondi.",
      confirm: "OK"
    },
    copyError: {
      title: "Copia Fallita",
      message: "Impossibile copiare la chiave API negli appunti",
      close: "Chiudi"
    },
    editSuccess: {
      title: "Modifica Riuscita",
      message: "Aggiornato con successo",
      confirm: "OK"
    },
    editError: {
      title: "Modifica Fallita",
      message: "Impossibile aggiornare la chiave API",
      close: "Chiudi"
    },
    deleteSuccess: {
      title: "Eliminazione Riuscita",
      message: "Chiave API rimossa dal sistema",
      confirm: "OK"
    },
    deleteError: {
      title: "Eliminazione Fallita",
      message: "Impossibile eliminare la chiave API",
      close: "Chiudi"
    },
    genericError: {
      title: "Errore",
      message: "Si è verificato un errore sconosciuto",
      close: "Chiudi"
    }
  },

  errors: {
    generic: "Si è verificato un errore sconosciuto",
    network: "Si è verificato un errore di rete",
    database: "Si è verificato un errore del database",
    validation: "Si è verificato un errore di convalida",
    permission: "Accesso negato",
    notFound: "Risorsa non trovata"
  },

  addApiKeyDialog: {
    title: "Aggiungi Chiave API",
    batchImport: "Importazione in Lotti",
    batchImportInstructions: "Usa il modello Excel per importare chiavi API in lotti. Per favore, scarica prima il modello, compila i dati e poi carica.",
    downloadTemplate: "Scarica Modello",
    selectExcelFile: "Seleziona File Excel",
    supportedFormats: "Formati supportati: File Excel (.xlsx)",
    requiredColumns: "Colonne richieste: Nome | Chiave API | Piattaforma | Descrizione",
    savedToDownloads: "Salvato nella cartella dei download",
    openFile: "Apri File",
    back: "Indietro",
    submitting: "Invio in corso…",
    
    form: {
      nameLabel: "Nome",
      namePlaceholder: "Per favore, inserisci il nome della chiave API",
      keyLabel: "Chiave API",
      keyPlaceholder: "Per favore, inserisci la chiave API",
      platformLabel: "Piattaforma",
      platformPlaceholder: "es.: OpenAI, Claude, Gemini...",
      descriptionLabel: "Descrizione",
      descriptionPlaceholder: "Descrizione opzionale..."
    },

    errors: {
      nameRequired: "Il nome è richiesto",
      keyRequired: "La chiave API è richiesta",
      keyInvalid: "Il formato della chiave API non è valido"
    },

    previewNotAvailable: "Anteprima non disponibile",
    previewNotAvailableMessage: "Per favore, usa la funzione di anteprima nell'ambiente desktop",
    previewWindowError: "Errore della finestra di anteprima",
    error: "Errore",
    
    importSuccess: "Importazione Riuscita",
    importSuccessMessage: "{{succeeded}} chiavi API importate con successo, {{failed}} fallite",
    importFailed: "Importazione Fallita",
    importFailedMessage: "Si è verificato un errore durante l'importazione",
    importProcessError: "Si è verificato un errore durante l'elaborazione dell'importazione",

    addSuccess: "Aggiunta Riuscita",
    addSuccessMessage: "{{name}} aggiunto con successo",
    addFailed: "Aggiunta Fallita",
    addFailedMessage: "Si è verificato un errore durante l'aggiunta",

    fileFormatError: "Errore di Formato File",
    fileFormatErrorMessage: "Per favore, seleziona un file Excel (.xlsx o .xls)",
    excelParseError: "Errore di Analisi Excel",
    cannotParseExcelFile: "Impossibile analizzare il file Excel",
    parseProcessError: "Si è verificato un errore durante l'analisi",

    tauriPluginNotInitialized: "Plugin Tauri non inizializzato",
    tauriEnvironmentRequired: "Per favore, assicurati di eseguire nell'ambiente desktop Tauri",
    fileSelectionFailed: "Selezione File Fallita",
    cannotOpenFileDialog: "Impossibile aprire la finestra di dialogo del file",
    downloadFailed: "Download Fallito",
    downloadProcessError: "Si è verificato un errore durante il download del modello",
    openFileFailed: "Apertura File Fallita",
    cannotOpenDownloadedFile: "Impossibile aprire il file scaricato",
    
    templateDownloadSuccess: "Download del modello riuscito",
    downloadedToBrowser: "File scaricato nella posizione di download predefinita del browser",
    templateSavedMessage: "Il file del modello Excel \"{{fileName}}\" è stato salvato nella tua cartella dei download",
    
    info: "Informazione",
    fileSavedTo: "File salvato in: {{filePath}}"
  },

  themeToggle: {
    lightTheme: "Tema Chiaro",
    switchToLight: "Passa a Tema Chiaro",
    darkTheme: "Tema Scuro",
    switchToDark: "Passa a Tema Scuro",
    systemTheme: "Tema di Sistema",
    followSystem: "Segui Tema di Sistema",
    system: "Sistema",
    dark: "Scuro",
    light: "Chiaro"
  }
};