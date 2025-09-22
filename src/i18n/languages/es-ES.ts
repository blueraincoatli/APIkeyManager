export default {
  common: {
    ok: "Aceptar",
    cancel: "Cancelar",
    close: "Cerrar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    copy: "Copiar",
    search: "Buscar",
    add: "Agregar",
    settings: "Configuración",
    exit: "Salir",
    confirm: "Confirmar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    warning: "Advertencia"
  },

  floatingToolbar: {
    searchPlaceholder: "Buscar claves API...",
    addApiKey: "Agregar Clave API",
    more: "Más",
    settings: "Configuración",
    exit: "Salir de la Aplicación",
    loadingPlatforms: "Cargando plataformas..."
  },

  settings: {
    title: "Configuración",
    theme: "Tema",
    language: "Idioma",
    shortcuts: "Atajos",
    aboutTitle: "Acerca de",
    
    themeOptions: {
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema"
    },

    shortcutsToggle: "Mostrar/Ocultar",

    about: {
      title: "API Key Manager",
      version: "v1.0.0",
      description: "Una herramienta moderna de gestión de claves API para que los desarrolladores almacenen y gestionen claves API de forma segura."
    }
  },

  apiKey: {
    name: "Nombre",
    keyValue: "Clave API",
    platform: "Plataforma",
    description: "Descripción",
    tags: "Etiquetas",
    group: "Grupo",
    createdAt: "Creado",
    updatedAt: "Actualizado",
    lastUsed: "Último Uso",

    actions: {
      add: "Agregar Clave API",
      edit: "Editar",
      delete: "Eliminar",
      copy: "Copiar",
      copySuccess: "Copiado al portapapeles",
      copyWarning: "La clave API ha sido copiada al portapapeles. Tenga en cuenta los riesgos de seguridad. El sistema limpiará el portapapeles en 30 segundos.",
      deleteConfirm: "¿Está seguro de que desea eliminar?",
      deleteSuccess: "Clave API eliminada del sistema",
      editSuccess: "Actualizado exitosamente"
    },

    form: {
      nameLabel: "Nombre",
      namePlaceholder: "Ingrese el nombre de la clave API",
      keyLabel: "Clave API",
      keyPlaceholder: "Ingrese la clave API",
      platformLabel: "Plataforma",
      platformPlaceholder: "Seleccionar plataforma",
      descriptionLabel: "Descripción",
      descriptionPlaceholder: "Ingrese descripción (opcional)",
      tagsLabel: "Etiquetas",
      tagsPlaceholder: "Ingrese etiquetas separadas por comas",
      submit: "Guardar",
      cancel: "Cancelar"
    }
  },

  searchResults: {
    noResults: "Sin resultados",
    namePlaceholder: "Nombre",
    keyPlaceholder: "Clave API",
    save: "Guardar",
    cancel: "Cancelar",
    confirmDelete: "¿Está seguro de que desea eliminar?",
    confirm: "Confirmar",
    edit: "Editar",
    delete: "Eliminar",
    copy: "Copiar",
    copySuccess: "Copia Exitosa",
    copySuccessMessage: "La clave API ha sido copiada al portapapeles. Tenga en cuenta los riesgos de seguridad. El sistema limpiará el portapapeles en 30 segundos.",
    copyFailed: "Error al Copiar",
    copyFailedMessage: "No se pudo copiar la clave API al portapapeles",
    editSuccess: "Edición Exitosa",
    editSuccessMessage: "{{name}} actualizado exitosamente",
    editFailed: "Error al Editar",
    editFailedMessage: "No se pudo actualizar la clave API",
    deleteSuccess: "Eliminación Exitosa",
    deleteSuccessMessage: "Clave API eliminada del sistema",
    deleteFailed: "Error al Eliminar",
    deleteFailedMessage: "No se pudo eliminar la clave API",
    unknownError: "Ocurrió un error desconocido",
    close: "Cerrar"
  },

  radialMenu: {
    loading: "Cargando plataformas..."
  },

  modal: {
    copySuccess: {
      title: "Copia Exitosa",
      message: "La clave API ha sido copiada al portapapeles. Tenga en cuenta los riesgos de seguridad. El sistema limpiará el portapapeles en 30 segundos.",
      confirm: "Aceptar"
    },
    copyError: {
      title: "Error al Copiar",
      message: "No se pudo copiar la clave API al portapapeles",
      close: "Cerrar"
    },
    editSuccess: {
      title: "Edición Exitosa",
      message: "Actualizado exitosamente",
      confirm: "Aceptar"
    },
    editError: {
      title: "Error al Editar",
      message: "No se pudo actualizar la clave API",
      close: "Cerrar"
    },
    deleteSuccess: {
      title: "Eliminación Exitosa",
      message: "Clave API eliminada del sistema",
      confirm: "Aceptar"
    },
    deleteError: {
      title: "Error al Eliminar",
      message: "No se pudo eliminar la clave API",
      close: "Cerrar"
    },
    genericError: {
      title: "Error",
      message: "Ocurrió un error desconocido",
      close: "Cerrar"
    }
  },

  errors: {
    generic: "Ocurrió un error desconocido",
    network: "Ocurrió un error de red",
    database: "Ocurrió un error de base de datos",
    validation: "Ocurrió un error de validación",
    permission: "Permiso denegado",
    notFound: "Recurso no encontrado"
  },

  addApiKeyDialog: {
    title: "Agregar Clave API",
    batchImport: "Importación Lote",
    batchImportInstructions: "Use la plantilla Excel para importar claves API por lote. Por favor, descargue la plantilla primero, complete los datos y luego suba.",
    downloadTemplate: "Descargar Plantilla",
    selectExcelFile: "Seleccionar Archivo Excel",
    supportedFormats: "Formatos soportados: Archivos Excel (.xlsx)",
    requiredColumns: "Columnas requeridas: Nombre | Clave API | Plataforma | Descripción",
    savedToDownloads: "Guardado en carpeta de descargas",
    openFile: "Abrir Archivo",
    back: "Volver",
    submitting: "Enviando…",
    
    form: {
      nameLabel: "Nombre",
      namePlaceholder: "Por favor, ingrese el nombre de la clave API",
      keyLabel: "Clave API",
      keyPlaceholder: "Por favor, ingrese la clave API",
      platformLabel: "Plataforma",
      platformPlaceholder: "ej.: OpenAI, Claude, Gemini...",
      descriptionLabel: "Descripción",
      descriptionPlaceholder: "Descripción opcional..."
    },

    errors: {
      nameRequired: "El nombre es requerido",
      keyRequired: "La clave API es requerida",
      keyInvalid: "El formato de la clave API es inválido"
    },

    previewNotAvailable: "Vista previa no disponible",
    previewNotAvailableMessage: "Por favor, use la función de vista previa en el entorno de escritorio",
    previewWindowError: "Error en la ventana de vista previa",
    error: "Error",
    
    importSuccess: "Importación Exitosa",
    importSuccessMessage: "{{succeeded}} claves API importadas exitosamente, {{failed}} fallaron",
    importFailed: "Importación Fallida",
    importFailedMessage: "Ocurrió un error durante la importación",
    importProcessError: "Ocurrió un error durante el procesamiento de la importación",

    addSuccess: "Agregar Exitoso",
    addSuccessMessage: "{{name}} agregado exitosamente",
    addFailed: "Agregar Fallido",
    addFailedMessage: "Ocurrió un error durante la agregación",

    fileFormatError: "Error de Formato de Archivo",
    fileFormatErrorMessage: "Por favor, seleccione un archivo Excel (.xlsx o .xls)",
    excelParseError: "Error de Análisis de Excel",
    cannotParseExcelFile: "No se puede analizar el archivo Excel",
    parseProcessError: "Ocurrió un error durante el análisis",

    tauriPluginNotInitialized: "Plugin Tauri no inicializado",
    tauriEnvironmentRequired: "Por favor, asegúrese de ejecutar en el entorno de escritorio Tauri",
    fileSelectionFailed: "Selección de Archivo Fallida",
    cannotOpenFileDialog: "No se puede abrir el diálogo de archivo",
    downloadFailed: "Descarga Fallida",
    downloadProcessError: "Ocurrió un error durante la descarga de la plantilla",
    openFileFailed: "Error al Abrir Archivo",
    cannotOpenDownloadedFile: "No se puede abrir el archivo descargado",
    
    templateDownloadSuccess: "Descarga de plantilla exitosa",
    downloadedToBrowser: "Archivo descargado a la ubicación de descarga predeterminada del navegador",
    templateSavedMessage: "El archivo de plantilla Excel \"{{fileName}}\" ha sido guardado en su carpeta de descargas",
    
    info: "Información",
    fileSavedTo: "Archivo guardado en: {{filePath}}"
  },

  themeToggle: {
    lightTheme: "Tema Claro",
    switchToLight: "Cambiar a Tema Claro",
    darkTheme: "Tema Oscuro",
    switchToDark: "Cambiar a Tema Oscuro",
    systemTheme: "Tema del Sistema",
    followSystem: "Seguir Tema del Sistema",
    system: "Sistema",
    dark: "Oscuro",
    light: "Claro"
  }
};