// src/contexts/toast/ToastContext.tsx
import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
  Slot,
  $,
  type PropFunction,
} from '@builder.io/qwik';

// Toast type definitions
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Toast Context Type Definition
 * This defines what functionality the Toast system provides to the rest of the app.
 */
export interface ToastContextType {
  messages: ToastMessage[];  // Array of currently visible toast notifications
  showToast: PropFunction<(message: string, type?: ToastType, duration?: number) => void>;  // Function to display a new toast
  removeToast: PropFunction<(id: string) => void>;  // Function to manually dismiss a toast
}

// Create a unique Context ID for Qwik's dependency injection system
export const ToastContext = createContextId<ToastContextType>('toast-context');

/**
 * Toast Provider Component
 * This is the "brain" of the toast notification system.
 * 
 * How it works:
 * 1. Wraps your app (or a section of it) to provide toast functionality
 * 2. Manages an array of toast messages in reactive state
 * 3. Automatically removes toasts after their duration expires
 * 4. Renders all active toasts in a fixed container (top-right by default)
 * 
 * Junior Dev Note:
 * Think of this as a "notification manager" that sits at the top level of your app.
 * Any component below it can call `useToast()` to show notifications.
 */
export const ToastProvider = component$(() => {
  // Reactive state to hold all currently active toast messages
  const toastState = useStore<{ messages: ToastMessage[] }>({
    messages: [],
  });

  /**
   * Show Toast Function
   * This is the main function components will call to display a notification.
   * 
   * @param message - The text to display
   * @param type - Visual style: 'success' (green), 'error' (red), 'warning' (yellow), 'info' (blue)
   * @param duration - How long to show the toast in milliseconds (default: 3000ms = 3 seconds)
   */
  const showToast = $((message: string, type: ToastType = 'info', duration = 3000) => {
    // Generate a unique ID for this toast using timestamp + random string
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newToast: ToastMessage = {
      id,
      message,
      type,
      duration,
    };

    // Add the new toast to our array (Qwik will automatically re-render the UI)
    toastState.messages = [...toastState.messages, newToast];

    // Auto-remove after duration:
    // We add 300ms extra to allow the slide-out animation to complete before removal
    setTimeout(() => {
      toastState.messages = toastState.messages.filter((t: ToastMessage) => t.id !== id);
    }, duration + 300);
  });

  /**
   * Remove Toast Function
   * Allows manual dismissal when the user clicks the "X" button
   */
  const removeToast = $((id: string) => {
    toastState.messages = toastState.messages.filter((t: ToastMessage) => t.id !== id);
  });

  // Package everything into the context value
  const contextValue: ToastContextType = {
    messages: toastState.messages,
    showToast,
    removeToast,
  };

  // Provide this context to all child components
  useContextProvider(ToastContext, contextValue);

  return (
    <>
      <Slot />
      
      {/* 
          Toast Container:
          - 'fixed top-4 right-4': Pins the toasts to the top-right corner of the screen
          - 'z-50': High z-index ensures toasts appear above most other content
          - 'flex flex-col gap-3': Stacks multiple toasts vertically with spacing
          - 'pointer-events-none': The container itself doesn't block clicks (but toasts inside do)
          - 'aria-live="polite"': Tells screen readers to announce new toasts
      */}
      <div
        class="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toastState.messages.map((toast: ToastMessage) => (
          <ToastItem
            key={toast.id}
            message={toast}
            onClose$={removeToast}
          />
        ))}
      </div>
    </>
  );
});

/**
 * Toast Item Component (Internal)
 * This is the actual visual toast notification.
 * It's kept internal to this file since it's only used by ToastProvider.
 */
const ToastItem = component$<{
  message: ToastMessage;
  onClose$: PropFunction<(id: string) => void>;
}>(({ message, onClose$ }) => {

  // Icon definitions for each toast type
  const iconsByType = {
    success: (
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        />
      </svg>
    ),
  };

  // Color schemes for each toast type (bright, high-contrast for visibility)
  const colorsByType = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-600 text-white',
  };

  return (
    <div
      class={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-md pointer-events-auto animate-slide-in-right ${
        colorsByType[message.type as ToastType]
      }`}
      role="alert"
    >
      {/* Icon */}
      <div class="flex-shrink-0">{iconsByType[message.type as ToastType]}</div>
      
      {/* Message Text */}
      <p class="flex-1 text-sm font-medium">{message.message}</p>
      
      {/* Close Button */}
      <button
        onClick$={() => onClose$(message.id)}
        class="flex-shrink-0 ml-2 hover:opacity-80 transition-opacity"
        aria-label="Close notification"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
});
