import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-[300ms]
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <div className="bg-charcoal text-white px-6 py-3 rounded-[6px] shadow-lg">
        <p className="text-[var(--text-body)]">{message}</p>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, id: Date.now() });
  };

  const ToastContainer = () => {
    if (!toast) return null;
    
    return (
      <Toast 
        key={toast.id}
        message={toast.message} 
        onClose={() => setToast(null)} 
      />
    );
  };

  return { showToast, ToastContainer };
}
