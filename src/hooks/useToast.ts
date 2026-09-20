import { useState, useCallback } from 'react';
import { ToastNotification } from '../types';
import { generateSafeId } from '../utils/sanitizers';

export function useToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>, durationMs = 3500) => {
    const id = generateSafeId('toast');
    const newToast: ToastNotification = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    if (durationMs > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, durationMs);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
