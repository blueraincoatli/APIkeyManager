/**
 * Toast notification service
 * Provides a clean, non-intrusive way to display notifications to users
 */

import { UI_CONSTANTS } from "../constants";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

export interface ToastOptions {
  duration?: number;
  persistent?: boolean;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

/**
 * Toast notification service for managing non-intrusive user notifications
 * Provides type-safe methods for showing, managing, and subscribing to toast messages
 */
class ToastService {
  private listeners: Set<(toast: ToastMessage) => void> = new Set();
  private toasts: Map<string, ToastMessage> = new Map();

  /**
   * Subscribe to toast notifications
   * @param listener - Callback function to receive toast updates
   * @returns Unsubscribe function to remove the listener
   */
  subscribe(listener: (toast: ToastMessage) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Show a success toast notification
   * @param title - The main title text for the toast
   * @param message - Optional detailed message
   * @param options - Optional configuration for duration, persistence, and position
   */
  success(title: string, message?: string, options?: ToastOptions): void {
    this.show({
      type: "success",
      title,
      message,
      duration: options?.duration ?? UI_CONSTANTS.TOAST.DEFAULT_DURATION,
      persistent: options?.persistent ?? false,
    });
  }

  /**
   * Show an error toast notification with longer default duration
   * @param title - The main title text for the toast
   * @param message - Optional detailed message
   * @param options - Optional configuration for duration, persistence, and position
   */
  error(title: string, message?: string, options?: ToastOptions): void {
    this.show({
      type: "error",
      title,
      message,
      duration: options?.duration ?? UI_CONSTANTS.TOAST.ERROR_DURATION, // Errors stay longer
      persistent: options?.persistent ?? false,
    });
  }

  /**
   * Show a warning toast notification
   * @param title - The main title text for the toast
   * @param message - Optional detailed message
   * @param options - Optional configuration for duration, persistence, and position
   */
  warning(title: string, message?: string, options?: ToastOptions): void {
    this.show({
      type: "warning",
      title,
      message,
      duration: options?.duration ?? UI_CONSTANTS.TOAST.WARNING_DURATION,
      persistent: options?.persistent ?? false,
    });
  }

  /**
   * Show an info toast notification
   * @param title - The main title text for the toast
   * @param message - Optional detailed message
   * @param options - Optional configuration for duration, persistence, and position
   */
  info(title: string, message?: string, options?: ToastOptions): void {
    this.show({
      type: "info",
      title,
      message,
      duration: options?.duration ?? UI_CONSTANTS.TOAST.DEFAULT_DURATION,
      persistent: options?.persistent ?? false,
    });
  }

  /**
   * Show a toast with custom configuration
   */
  private show(config: Omit<ToastMessage, "id">): void {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const toast: ToastMessage = {
      id,
      ...config,
    };

    this.toasts.set(id, toast);
    this.notifyListeners(toast);

    // Auto-remove if not persistent
    if (!toast.persistent && toast.duration) {
      setTimeout(() => {
        this.remove(id);
      }, toast.duration);
    }
  }

  /**
   * Remove a toast notification by its ID
   * @param id - The unique identifier of the toast to remove
   */
  remove(id: string): void {
    if (this.toasts.has(id)) {
      this.toasts.delete(id);
      this.notifyListeners({ id, type: "info", title: "" }); // Signal removal
    }
  }

  /**
   * Clear all active toast notifications
   */
  clear(): void {
    this.toasts.clear();
  }

  /**
   * Get all active toasts
   */
  getActiveToasts(): ToastMessage[] {
    return Array.from(this.toasts.values());
  }

  /**
   * Notify all listeners about a toast
   */
  private notifyListeners(toast: ToastMessage): void {
    this.listeners.forEach((listener) => {
      try {
        listener(toast);
      } catch (error) {
        console.error("Error in toast listener:", error);
      }
    });
  }

  /**
   * Set default duration for toasts
   */
  setDefaultDuration(duration: number): void {
    (this as any).defaultDuration = duration;
  }

  /**
   * Set default position for toasts
   */
  setDefaultPosition(position: ToastOptions["position"]): void {
    (this as any).defaultPosition = position;
  }

  /**
   * Show a toast for API key operations
   */
  showApiKeySuccess(operation: string, details?: string): void {
    this.success(
      "API Key 操作成功",
      `${operation}${details ? ` - ${details}` : ""}`,
    );
  }

  /**
   * Show an error toast for API key operations
   */
  showApiKeyError(operation: string, error?: string): void {
    this.error(
      "API Key 操作失败",
      error ? `${operation}: ${error}` : operation,
    );
  }

  /**
   * Show a clipboard operation toast
   */
  showClipboardSuccess(operation: string): void {
    this.success("剪贴板操作成功", operation);
  }

  /**
   * Show a clipboard error toast
   */
  showClipboardError(operation: string, error?: string): void {
    this.error("剪贴板操作失败", error ? `${operation}: ${error}` : operation);
  }
}

// Export singleton instance
export const toastService = new ToastService();

// Export convenience functions for direct usage
export const toast = {
  success: (title: string, message?: string, options?: ToastOptions) =>
    toastService.success(title, message, options),
  error: (title: string, message?: string, options?: ToastOptions) =>
    toastService.error(title, message, options),
  warning: (title: string, message?: string, options?: ToastOptions) =>
    toastService.warning(title, message, options),
  info: (title: string, message?: string, options?: ToastOptions) =>
    toastService.info(title, message, options),
};
