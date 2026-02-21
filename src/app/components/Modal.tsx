import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-[300ms]"
        aria-hidden="true"
      />
      
      <div 
        className="relative bg-white rounded-[8px] max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-lg transition-all duration-[300ms]"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-8 pt-8 pb-6 border-b border-border-subtle">
            <h3 className="text-[var(--text-h3)] font-serif font-medium text-charcoal">{title}</h3>
          </div>
        )}
        
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
