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

  toolbar: {
    searchPlaceholder: "Rechercher des clés API...",
    addApiKey: "Ajouter une clé API",
    more: "Plus",
    settings: "Paramètres",
    exitApp: "Quitter l'application",
    exitTooltip: "Quitter l'application"
  },

  settings: {
    title: "Paramètres",
    theme: "Thème",
    language: "Langue",
    shortcuts: "Raccourcis",
    about: "À propos",
    
    themeOptions: {
      light: "Clair",
      dark: "Sombre",
      system: "Système"
    },

    shortcuts: {
      toggleToolbar: "Afficher/Masquer"
    },

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

  search: {
    noResults: "Aucun résultat",
    empty: "Aucun résultat trouvé"
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
  }
};