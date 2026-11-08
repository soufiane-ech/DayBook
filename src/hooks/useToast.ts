import { createContext, useContext } from 'react';

export interface ToastOptions {
  message: string;
  /** When given, the toast offers an Undo button and stays up longer. */
  undo?: () => void;
}

export const ToastContext = createContext<(toast: ToastOptions) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}
