'use client';

import React from 'react';
import { useToast } from '@/contexts/ToastContext';
import { ToastNotification } from './Toast';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="flex flex-col items-center space-y-3">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{ 
              zIndex: 50 + toasts.length - index,
            }}
          >
            <ToastNotification
              toast={toast}
              onRemove={removeToast}
            />
          </div>
        ))}
      </div>
    </div>
  );
};