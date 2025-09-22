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

  toolbar: {
    searchPlaceholder: "Cerca chiavi API...",
    addApiKey: "Aggiungi Chiave API",
    more: "Altro",
    settings: "Impostazioni",
    exitApp: "Esci dall'Applicazione",
    exitTooltip: "Esci dall'Applicazione"
  },

  settings: {
    title: "Impostazioni",
    theme: "Tema",
    language: "Lingua",
    shortcuts: "Scorciatoie",
    about: "Informazioni",
    
    themeOptions: {
      light: "Chiaro",
      dark: "Scuro",
      system: "Sistema"
    },

    shortcuts: {
      toggleToolbar: "Mostra/Nascondi"
    },

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

  search: {
    noResults: "Nessun risultato",
    empty: "Nessun risultato trovato"
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
  }
};