import React, { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { ToastMessage } from '../../services/toastService';
import { cn } from '../../utils/helpers';
import { UI_CONSTANTS } from '../../constants';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), UI_CONSTANTS.ANIMATION_DURATION.EXIT); // Wait for exit animation
  };

  // Auto-remove based on duration
  useEffect(() => {
    if (toast.duration && !toast.persistent) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.persistent]);

  const getToastStyles = () => {
    const baseStyles = 'transform transition-all ease-in-out translate-x-0 opacity-100';
    const exitStyles = 'transform translate-x-full opacity-0';
    const typeStyles = {
      success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700',
      error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700',
      warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700',
      info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700',
    };

    return cn(
      baseStyles,
      isExiting && exitStyles,
      typeStyles[toast.type],
      'p-4 rounded-lg border shadow-lg pointer-events-auto cursor-pointer hover:shadow-xl'
    );
  };

  const getIcon = () => {
    const iconStyles = 'flex-shrink-0 w-5 h-5';
    const iconColors: Record<'success'|'error'|'warning'|'info', string> = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500',
    };

    const icons: Record<'success'|'error'|'warning'|'info', React.ReactElement> = {
      success: (
        <svg className={cn(iconStyles, iconColors.success)} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className={cn(iconStyles, iconColors.error)} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className={cn(iconStyles, iconColors.warning)} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className={cn(iconStyles, iconColors.info)} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
    };

    return icons[toast.type];
  };

  return (
    <div
      className={getToastStyles()}
      onClick={handleRemove}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={cn(
              'text-sm font-medium',
              {
                'text-green-800 dark:text-green-200': toast.type === 'success',
                'text-red-800 dark:text-red-200': toast.type === 'error',
                'text-yellow-800 dark:text-yellow-200': toast.type === 'warning',
                'text-blue-800 dark:text-blue-200': toast.type === 'info',
              }
            )}>
              {toast.title}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className={cn(
                'flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded'
              )}
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {toast.message && (
            <p className={cn(
              'mt-1 text-sm',
              {
                'text-green-700 dark:text-green-300': toast.type === 'success',
                'text-red-700 dark:text-red-300': toast.type === 'error',
                'text-yellow-700 dark:text-yellow-300': toast.type === 'warning',
                'text-blue-700 dark:text-blue-300': toast.type === 'info',
              }
            )}>
              {toast.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  limit?: number;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  limit = UI_CONSTANTS.LAYOUT.MAX_TOAST_LIMIT,
}) => {
  const { toasts, removeToast } = useToast();

  const getPositionStyles = () => {
    const baseStyles = 'fixed z-50 p-4 space-y-4';

    const positions = {
      'top-right': 'top-0 right-0',
      'top-left': 'top-0 left-0',
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
    };

    return cn(baseStyles, positions[position]);
  };

  // Limit the number of toasts displayed
  const visibleToasts = toasts.slice(-limit);

  return (
    <div className={getPositionStyles()}>
      {visibleToasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
