'use client';

import React, { useEffect, useState } from 'react';
import type { Toast as ToastMessage, ToastType } from '@/lib/types/toast';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return (
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'error':
      return (
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'warning':
      return (
        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'info':
      return (
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
      );
    default:
      return null;
  }
};

export const ToastNotification: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Initial animation sequence
    setTimeout(() => setIsVisible(true), 50);
    setTimeout(() => setIsExpanded(true), 200);
    
    // Auto-collapse after some time
    setTimeout(() => setIsExpanded(false), toast.duration ? toast.duration - 800 : 3200);
  }, [toast.duration]);

  const handleRemove = () => {
    setIsExpanded(false);
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 200);
    }, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-500 ease-out
        ${isVisible && !isLeaving 
          ? 'translate-y-0 opacity-100 scale-100' 
          : '-translate-y-4 opacity-0 scale-95'
        }
      `}
      style={{
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        className={`
          relative overflow-hidden
          bg-black/90 backdrop-blur-xl
          border border-white/10
          text-white
          shadow-2xl shadow-black/50
          transition-all duration-500 ease-out
          cursor-pointer pointer-events-auto
          ${isExpanded 
            ? 'rounded-2xl px-6 py-4 min-w-80 max-w-md' 
            : 'rounded-full px-4 py-3 min-w-32'
          }
        `}
        style={{
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Compact State */}
        <div className={`flex items-center justify-center transition-all duration-300 ${isExpanded ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
          {getToastIcon(toast.type)}
          {!isExpanded && (
            <span className="ml-2 text-sm font-medium truncate max-w-20">
              {toast.title}
            </span>
          )}
        </div>

        {/* Expanded State */}
        <div className={`${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 absolute inset-0 pointer-events-none'} transition-all duration-300 delay-100`}>
          <div className="flex items-start space-x-3">
            {getToastIcon(toast.type)}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white truncate">
                  {toast.title}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {toast.message && (
                <p className="mt-1 text-sm text-white/80 leading-snug">
                  {toast.message}
                </p>
              )}
              
              {toast.action && (
                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.action?.onClick();
                      handleRemove();
                    }}
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {toast.action.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ambient glow effect */}
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-xl opacity-50" />
      </div>
    </div>
  );
};