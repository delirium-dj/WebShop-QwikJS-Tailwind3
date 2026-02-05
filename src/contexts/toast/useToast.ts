// src/contexts/toast/useToast.ts
import { useContext } from '@builder.io/qwik';
import { ToastContext, type ToastContextType } from './ToastContext';

/**
 * Custom hook to access toast notifications
 * 
 * @example
 * ```tsx
 * export default component$(() => {
 *   const toast = useToast();
 *   
 *   return (
 *     <button onClick$={() => toast.showToast('Success!', 'success')}>
 *       Show Toast
 *     </button>
 *   );
 * });
 * ```
 */
export const useToast = (): ToastContextType => {
  const toast = useContext(ToastContext);
  
  if (!toast) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return toast;
};
