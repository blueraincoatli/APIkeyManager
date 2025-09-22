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

  toolbar: {
    searchPlaceholder: "Buscar claves API...",
    addApiKey: "Agregar Clave API",
    more: "Más",
    settings: "Configuración",
    exitApp: "Salir de la Aplicación",
    exitTooltip: "Salir de la Aplicación"
  },

  settings: {
    title: "Configuración",
    theme: "Tema",
    language: "Idioma",
    shortcuts: "Atajos",
    about: "Acerca de",
    
    themeOptions: {
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema"
    },

    shortcuts: {
      toggleToolbar: "Mostrar/Ocultar"
    },

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

  search: {
    noResults: "Sin resultados",
    empty: "No se encontraron resultados"
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
  }
};