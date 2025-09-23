import { useState, useEffect, useCallback } from "react";
import { toastService, ToastMessage } from "../services/toastService";

interface UseToastReturn {
  // Toast actions
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;

  // Toast management
  removeToast: (id: string) => void;
  clearAllToasts: () => void;

  // State
  toasts: ToastMessage[];
}

/**
 * Hook for managing toast notifications
 */
export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Subscribe to toast service updates
  useEffect(() => {
    const unsubscribe = toastService.subscribe((toast) => {
      setToasts((currentToasts) => {
        // Check if this is a removal signal (empty title)
        if (!toast.title) {
          return currentToasts.filter((t) => t.id !== toast.id);
        }

        // Check if toast already exists
        const existingIndex = currentToasts.findIndex((t) => t.id === toast.id);
        if (existingIndex >= 0) {
          // Update existing toast
          const updatedToasts = [...currentToasts];
          updatedToasts[existingIndex] = toast;
          return updatedToasts;
        } else {
          // Add new toast
          return [...currentToasts, toast];
        }
      });
    });

    return unsubscribe;
  }, []);

  // Toast action methods
  const success = useCallback((title: string, message?: string) => {
    toastService.success(title, message);
  }, []);

  const error = useCallback((title: string, message?: string) => {
    toastService.error(title, message);
  }, []);

  const warning = useCallback((title: string, message?: string) => {
    toastService.warning(title, message);
  }, []);

  const info = useCallback((title: string, message?: string) => {
    toastService.info(title, message);
  }, []);

  // Management methods
  const removeToast = useCallback((id: string) => {
    toastService.remove(id);
  }, []);

  const clearAllToasts = useCallback(() => {
    toastService.clear();
  }, []);

  return {
    // Actions
    success,
    error,
    warning,
    info,

    // Management
    removeToast,
    clearAllToasts,

    // State
    toasts,
  };
};

/**
 * Hook for API-specific toast notifications with predefined messages
 * @returns Object containing convenience methods for common API operations
 */
export const useApiToast = () => {
  const toast = useToast();

  return {
    // API Key specific toasts
    showCopySuccess: () => toast.success("Copied to clipboard"),
    showCopyError: () => toast.error("Copy failed"),
    showDeleteSuccess: () => toast.success("Delete successful"),
    showDeleteError: (error?: string) => toast.error("Delete failed", error),
    showAddSuccess: () => toast.success("Add successful"),
    showAddError: (error?: string) => toast.error("Add failed", error),
    showEditSuccess: () => toast.success("Edit successful"),
    showEditError: (error?: string) => toast.error("Edit failed", error),

    // Clipboard specific toasts
    showImportSuccess: () => toast.success("API Key imported successfully!"),
    showImportError: () => toast.error("API Key import failed!"),
    showAnalyzeSuccess: () => toast.success("Analysis completed"),
    showAnalyzeError: () => toast.error("Analysis failed"),

    // Generic success/error methods
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
  };
};
