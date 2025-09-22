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

  floatingToolbar: {
    searchPlaceholder: "Search API keys...",
    addApiKey: "Add API Key",
    more: "More",
    settings: "Settings",
    exit: "Exit Application",
    loadingPlatforms: "Loading platforms..."
  },

  settings: {
    title: "Settings",
    theme: "Theme",
    language: "Language",
    shortcuts: "Shortcuts",
    aboutTitle: "About",
    
    themeOptions: {
      light: "Light",
      dark: "Dark",
      system: "System"
    },

    shortcutsToggle: "Toggle/Hide",

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

  searchResults: {
    noResults: "No results",
    namePlaceholder: "Name",
    keyPlaceholder: "API Key",
    save: "Save",
    cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete?",
    confirm: "Confirm",
    edit: "Edit",
    delete: "Delete",
    copy: "Copy",
    copySuccess: "Copy Successful",
    copySuccessMessage: "API Key has been copied to clipboard. Please be aware of security risks. System will clear clipboard in 30 seconds.",
    copyFailed: "Copy Failed",
    copyFailedMessage: "Unable to copy API Key to clipboard",
    editSuccess: "Edit Successful",
    editSuccessMessage: "{{name}} updated successfully",
    editFailed: "Edit Failed",
    editFailedMessage: "Unable to update API Key",
    deleteSuccess: "Delete Successful",
    deleteSuccessMessage: "API Key removed from system",
    deleteFailed: "Delete Failed",
    deleteFailedMessage: "Unable to delete API Key",
    unknownError: "An unknown error occurred",
    close: "Close"
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
  },

  addApiKeyDialog: {
    title: "Add API Key",
    batchImport: "Batch Import",
    batchImportInstructions: "Use Excel template to batch import API keys. Please download the template first, fill in the data, and then upload.",
    downloadTemplate: "Download Template",
    selectExcelFile: "Select Excel File",
    supportedFormats: "Supported formats: Excel files (.xlsx)",
    requiredColumns: "Required columns: Name | API Key | Platform | Description",
    savedToDownloads: "Saved to downloads folder",
    openFile: "Open File",
    back: "Back",
    submitting: "Submitting…",
    
    form: {
      nameLabel: "Name",
      namePlaceholder: "Please enter API key name",
      keyLabel: "API Key",
      keyPlaceholder: "Please enter API key",
      platformLabel: "Platform",
      platformPlaceholder: "e.g.: OpenAI, Claude, Gemini...",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Optional description..."
    },

    errors: {
      nameRequired: "Name is required",
      keyRequired: "API key is required",
      keyInvalid: "API key format is invalid"
    },

    previewNotAvailable: "Preview not available",
    previewNotAvailableMessage: "Please use preview function in desktop environment",
    previewWindowError: "Preview window error",
    error: "Error",
    
    importSuccess: "Import Success",
    importSuccessMessage: "Successfully imported {{succeeded}} API keys, {{failed}} failed",
    importFailed: "Import Failed",
    importFailedMessage: "Error occurred during import",
    importProcessError: "Error occurred during import processing",

    addSuccess: "Add Success",
    addSuccessMessage: "{{name}} added successfully",
    addFailed: "Add Failed",
    addFailedMessage: "Error occurred during add",

    fileFormatError: "File Format Error",
    fileFormatErrorMessage: "Please select Excel file (.xlsx or .xls)",
    excelParseError: "Excel Parse Error",
    cannotParseExcelFile: "Cannot parse Excel file",
    parseProcessError: "Error occurred during parsing",

    tauriPluginNotInitialized: "Tauri plugin not initialized",
    tauriEnvironmentRequired: "Please ensure running in Tauri desktop environment",
    fileSelectionFailed: "File Selection Failed",
    cannotOpenFileDialog: "Cannot open file dialog",
    downloadFailed: "Download Failed",
    downloadProcessError: "Error occurred during template download",
    openFileFailed: "Open File Failed",
    cannotOpenDownloadedFile: "Cannot open downloaded file",
    
    templateDownloadSuccess: "Template download success",
    downloadedToBrowser: "File downloaded to browser default download location",
    templateSavedMessage: "Excel template file \"{{fileName}}\" has been saved to your downloads folder",
    
    info: "Info",
    fileSavedTo: "File saved to: {{filePath}}"
  },

  themeToggle: {
    lightTheme: "Light Theme",
    switchToLight: "Switch to Light Theme",
    darkTheme: "Dark Theme",
    switchToDark: "Switch to Dark Theme",
    systemTheme: "System Theme",
    followSystem: "Follow System Theme",
    system: "System",
    dark: "Dark",
    light: "Light"
  }
};