export default {
  common: {
    ok: "OK",
    cancel: "Cancel",
    close: "Close",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    copy: "Copy",
    search: "Search",
    add: "Add",
    settings: "Settings",
    exit: "Exit",
    confirm: "Confirm",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning"
  },

  toolbar: {
    searchPlaceholder: "Search API keys...",
    addApiKey: "Add API Key",
    more: "More",
    settings: "Settings",
    exitApp: "Exit Application",
    exitTooltip: "Exit Application"
  },

  settings: {
    title: "Settings",
    theme: "Theme",
    language: "Language",
    shortcuts: "Shortcuts",
    about: "About",
    
    themeOptions: {
      light: "Light",
      dark: "Dark",
      system: "System"
    },

    shortcuts: {
      toggleToolbar: "Toggle/Hide"
    },

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description: "A modern API key management tool for developers to securely store and manage API keys."
    }
  },

  apiKey: {
    name: "Name",
    keyValue: "API Key",
    platform: "Platform",
    description: "Description",
    tags: "Tags",
    group: "Group",
    createdAt: "Created",
    updatedAt: "Updated",
    lastUsed: "Last Used",

    actions: {
      add: "Add API Key",
      edit: "Edit",
      delete: "Delete",
      copy: "Copy",
      copySuccess: "Copied to clipboard",
      copyWarning: "API Key copied to clipboard. Please be aware of security risks. System will clear clipboard in 30 seconds.",
      deleteConfirm: "Are you sure you want to delete?",
      deleteSuccess: "API Key removed from system",
      editSuccess: "Updated successfully"
    },

    form: {
      nameLabel: "Name",
      namePlaceholder: "Enter API key name",
      keyLabel: "API Key",
      keyPlaceholder: "Enter API key",
      platformLabel: "Platform",
      platformPlaceholder: "Select platform",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Enter description (optional)",
      tagsLabel: "Tags",
      tagsPlaceholder: "Enter tags separated by commas",
      submit: "Save",
      cancel: "Cancel"
    }
  },

  search: {
    noResults: "No results",
    empty: "No results found"
  },

  radialMenu: {
    loading: "Loading platforms..."
  },

  modal: {
    copySuccess: {
      title: "Copy Successful",
      message: "API Key has been copied to clipboard. Please be aware of security risks. System will clear clipboard in 30 seconds.",
      confirm: "OK"
    },
    copyError: {
      title: "Copy Failed",
      message: "Unable to copy API Key to clipboard",
      close: "Close"
    },
    editSuccess: {
      title: "Edit Successful",
      message: "Updated successfully",
      confirm: "OK"
    },
    editError: {
      title: "Edit Failed",
      message: "Unable to update API Key",
      close: "Close"
    },
    deleteSuccess: {
      title: "Delete Successful",
      message: "API Key removed from system",
      confirm: "OK"
    },
    deleteError: {
      title: "Delete Failed",
      message: "Unable to delete API Key",
      close: "Close"
    },
    genericError: {
      title: "Error",
      message: "An unknown error occurred",
      close: "Close"
    }
  },

  errors: {
    generic: "An unknown error occurred",
    network: "Network error occurred",
    database: "Database error occurred",
    validation: "Validation error occurred",
    permission: "Permission denied",
    notFound: "Resource not found"
  }
};