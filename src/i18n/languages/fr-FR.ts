export default {
  common: {
    ok: "OK",
    cancel: "Annuler",
    close: "Fermer",
    save: "Enregistrer",
    delete: "Supprimer",
    edit: "Modifier",
    copy: "Copier",
    search: "Rechercher",
    add: "Ajouter",
    settings: "Paramètres",
    exit: "Quitter",
    confirm: "Confirmer",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    warning: "Avertissement"
  },

  floatingToolbar: {
    searchPlaceholder: "Rechercher des clés API...",
    addApiKey: "Ajouter une clé API",
    more: "Plus",
    settings: "Paramètres",
    exit: "Quitter l'application",
    loadingPlatforms: "Chargement des plateformes..."
  },

  settings: {
    title: "Paramètres",
    theme: "Thème",
    language: "Langue",
    shortcuts: "Raccourcis",
    aboutTitle: "À propos",
    
    themeOptions: {
      light: "Clair",
      dark: "Sombre",
      system: "Système"
    },

    shortcutsToggle: "Afficher/Masquer",

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description: "Un outil moderne de gestion de clés API pour que les développeurs stockent et gèrent des clés API en toute sécurité."
    }
  },

  apiKey: {
    name: "Nom",
    keyValue: "Clé API",
    platform: "Plateforme",
    description: "Description",
    tags: "Étiquettes",
    group: "Groupe",
    createdAt: "Créé",
    updatedAt: "Mis à jour",
    lastUsed: "Dernière utilisation",

    actions: {
      add: "Ajouter une clé API",
      edit: "Modifier",
      delete: "Supprimer",
      copy: "Copier",
      copySuccess: "Copié dans le presse-papiers",
      copyWarning: "La clé API a été copiée dans le presse-papiers. Veuillez être conscient des risques de sécurité. Le système effacera le presse-papiers dans 30 secondes.",
      deleteConfirm: "Êtes-vous sûr de vouloir supprimer ?",
      deleteSuccess: "Clé API supprimée du système",
      editSuccess: "Mise à jour réussie"
    },

    form: {
      nameLabel: "Nom",
      namePlaceholder: "Entrez le nom de la clé API",
      keyLabel: "Clé API",
      keyPlaceholder: "Entrez la clé API",
      platformLabel: "Plateforme",
      platformPlaceholder: "Sélectionner une plateforme",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Entrez la description (optionnel)",
      tagsLabel: "Étiquettes",
      tagsPlaceholder: "Entrez les étiquettes séparées par des virgules",
      submit: "Enregistrer",
      cancel: "Annuler"
    }
  },

  searchResults: {
    noResults: "Aucun résultat",
    namePlaceholder: "Nom",
    keyPlaceholder: "Clé API",
    save: "Enregistrer",
    cancel: "Annuler",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer ?",
    confirm: "Confirmer",
    edit: "Modifier",
    delete: "Supprimer",
    copy: "Copier",
    copySuccess: "Copie réussie",
    copySuccessMessage: "La clé API a été copiée dans le presse-papiers. Veuillez être conscient des risques de sécurité. Le système effacera le presse-papiers dans 30 secondes.",
    copyFailed: "Échec de la copie",
    copyFailedMessage: "Impossible de copier la clé API dans le presse-papiers",
    editSuccess: "Modification réussie",
    editSuccessMessage: "{{name}} mis à jour avec succès",
    editFailed: "Échec de la modification",
    editFailedMessage: "Impossible de mettre à jour la clé API",
    deleteSuccess: "Suppression réussie",
    deleteSuccessMessage: "Clé API supprimée du système",
    deleteFailed: "Échec de la suppression",
    deleteFailedMessage: "Impossible de supprimer la clé API",
    unknownError: "Une erreur inconnue s'est produite",
    close: "Fermer"
  },

  radialMenu: {
    loading: "Chargement des plateformes..."
  },

  modal: {
    copySuccess: {
      title: "Copie réussie",
      message: "La clé API a été copiée dans le presse-papiers. Veuillez être conscient des risques de sécurité. Le système effacera le presse-papiers dans 30 secondes.",
      confirm: "OK"
    },
    copyError: {
      title: "Échec de la copie",
      message: "Impossible de copier la clé API dans le presse-papiers",
      close: "Fermer"
    },
    editSuccess: {
      title: "Modification réussie",
      message: "Mise à jour réussie",
      confirm: "OK"
    },
    editError: {
      title: "Échec de la modification",
      message: "Impossible de mettre à jour la clé API",
      close: "Fermer"
    },
    deleteSuccess: {
      title: "Suppression réussie",
      message: "Clé API supprimée du système",
      confirm: "OK"
    },
    deleteError: {
      title: "Échec de la suppression",
      message: "Impossible de supprimer la clé API",
      close: "Fermer"
    },
    genericError: {
      title: "Erreur",
      message: "Une erreur inconnue s'est produite",
      close: "Fermer"
    }
  },

  errors: {
    generic: "Une erreur inconnue s'est produite",
    network: "Une erreur réseau s'est produite",
    database: "Une erreur de base de données s'est produite",
    validation: "Une erreur de validation s'est produite",
    permission: "Accès refusé",
    notFound: "Ressource non trouvée"
  },

  addApiKeyDialog: {
    title: "Ajouter une clé API",
    batchImport: "Importation par lots",
    batchImportInstructions: "Utilisez le modèle Excel pour importer des clés API par lots. Veuillez d'abord télécharger le modèle, remplir les données, puis télécharger.",
    downloadTemplate: "Télécharger le modèle",
    selectExcelFile: "Sélectionner un fichier Excel",
    supportedFormats: "Formats pris en charge : Fichiers Excel (.xlsx)",
    requiredColumns: "Colonnes requises : Nom | Clé API | Plateforme | Description",
    savedToDownloads: "Enregistré dans le dossier des téléchargements",
    openFile: "Ouvrir le fichier",
    back: "Retour",
    submitting: "Envoi en cours…",
    
    form: {
      nameLabel: "Nom",
      namePlaceholder: "Veuillez entrer le nom de la clé API",
      keyLabel: "Clé API",
      keyPlaceholder: "Veuillez entrer la clé API",
      platformLabel: "Plateforme",
      platformPlaceholder: "ex. : OpenAI, Claude, Gemini...",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Description optionnelle..."
    },

    errors: {
      nameRequired: "Le nom est requis",
      keyRequired: "La clé API est requise",
      keyInvalid: "Le format de la clé API est invalide"
    },

    previewNotAvailable: "Aperçu non disponible",
    previewNotAvailableMessage: "Veuillez utiliser la fonction d'aperçu dans l'environnement de bureau",
    previewWindowError: "Erreur de la fenêtre d'aperçu",
    error: "Erreur",
    
    importSuccess: "Importation réussie",
    importSuccessMessage: "{{succeeded}} clés API importées avec succès, {{failed}} échecs",
    importFailed: "Échec de l'importation",
    importFailedMessage: "Une erreur s'est produite lors de l'importation",
    importProcessError: "Une erreur s'est produite lors du traitement de l'importation",

    addSuccess: "Ajout réussi",
    addSuccessMessage: "{{name}} ajouté avec succès",
    addFailed: "Échec de l'ajout",
    addFailedMessage: "Une erreur s'est produite lors de l'ajout",

    fileFormatError: "Erreur de format de fichier",
    fileFormatErrorMessage: "Veuillez sélectionner un fichier Excel (.xlsx ou .xls)",
    excelParseError: "Erreur d'analyse Excel",
    cannotParseExcelFile: "Impossible d'analyser le fichier Excel",
    parseProcessError: "Une erreur s'est produite lors de l'analyse",

    tauriPluginNotInitialized: "Plugin Tauri non initialisé",
    tauriEnvironmentRequired: "Veuillez vous assurer d'exécuter dans l'environnement de bureau Tauri",
    fileSelectionFailed: "Échec de la sélection de fichier",
    cannotOpenFileDialog: "Impossible d'ouvrir la boîte de dialogue de fichier",
    downloadFailed: "Échec du téléchargement",
    downloadProcessError: "Une erreur s'est produite lors du téléchargement du modèle",
    openFileFailed: "Échec de l'ouverture du fichier",
    cannotOpenDownloadedFile: "Impossible d'ouvrir le fichier téléchargé",
    
    templateDownloadSuccess: "Téléchargement du modèle réussi",
    downloadedToBrowser: "Fichier téléchargé vers l'emplacement de téléchargement par défaut du navigateur",
    templateSavedMessage: "Le fichier de modèle Excel \"{{fileName}}\" a été enregistré dans votre dossier de téléchargements",
    
    info: "Information",
    fileSavedTo: "Fichier enregistré dans : {{filePath}}"
  },

  themeToggle: {
    lightTheme: "Thème Clair",
    switchToLight: "Passer au Thème Clair",
    darkTheme: "Thème Sombre",
    switchToDark: "Passer au Thème Sombre",
    systemTheme: "Thème Système",
    followSystem: "Suivre le Thème Système",
    system: "Système",
    dark: "Sombre",
    light: "Clair"
  }
};