import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ 
  label, 
  error, 
  helperText,
  className = '',
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[var(--text-body)] font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border rounded-[6px] bg-white transition-all duration-[250ms]
          ${error 
            ? 'border-error focus:border-error focus:ring-2 focus:ring-error-bg' 
            : 'border-border-default focus:border-accent focus:ring-2 focus:ring-accent/10'
          }
          placeholder:text-text-muted
          disabled:bg-surface disabled:cursor-not-allowed disabled:opacity-60
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-[var(--text-small)] text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-[var(--text-small)] text-text-secondary">{helperText}</p>
      )}
    </div>
  );
}
